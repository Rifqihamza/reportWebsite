import type { APIContext } from "astro";
import { create_response_status, get_cookies_from_request, record_activity, verify_user_data_token } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";
import { ActivityType, Prisma, type Report } from "@prisma/client";
import { account_to_api_privillage, AccountAPIPrivillage, type ReportData } from "../../../types/variables";
import { APIResultType } from "../../../utils/api_interface";

export async function PUT({ request, clientAddress }: APIContext) {
    // Verify user_token
    const cookies = get_cookies_from_request(request);
          
    const [verification_result, verification_output, user_data] = await verify_user_data_token(cookies ? (cookies["user_token"] ?? "") : "");
    if(verification_result !== true) {
        if(verification_output === APIResultType.DatabaseError) {
            return create_response_status(503);
        }
        else if(verification_output === APIResultType.InternalServerError) {
            return create_response_status(500);
        }
        
        return create_response_status(401);
    }
      
    // Verify user role
    if(!account_to_api_privillage[user_data.role].includes(AccountAPIPrivillage.UpdateReport)) {
        return create_response_status(401);
    }


    // Get the required data
    const { report_id, report_data: new_report_data }: { report_id: string, report_data: ReportData } = await request.json();
    if (!report_id || !new_report_data) {
        return create_response_status(400);
    }

    // Verify the data exists
    let prev_report_data: Report | null;
    try {
        prev_report_data = await prisma.report.findUnique({
            where: {
                id: report_id
            }
        });

        if(!prev_report_data) {
            return create_response_status(400);
        }
    }
    catch(err) {
        if(err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }
        console.error(`There's an error when trying to get report data for verification: ${err}`);
        return create_response_status(500);
    }
    
    
    // Update the data
    try {
        await prisma.report.update({
            where: {
                id: report_id
            },
            data: {
                submitted_by: new_report_data.submitted_by ?? undefined,
                message: new_report_data.message ?? undefined,
                type: new_report_data.type ?? undefined,
                status: new_report_data.status ?? undefined,
                follow_up: new_report_data.follow_up || undefined,
                follow_up_name: new_report_data.follow_up_name ?? undefined,
                report_date: new_report_data.report_date ?? undefined,
                due_date: new_report_data.due_date === "" ? null : (new_report_data.due_date || undefined),
                report_location: (new_report_data.location_name && new_report_data.pic_name) ? {
                    connect: {
                        location_pic_name: {
                            pic_name: new_report_data.pic_name,
                            location: new_report_data.location_name
                        }
                    }
                } : undefined
            }
        });
    }
    catch(err) {
        if(err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }
        console.error(`There's an error when trying to update report data: ${err}`);
        return create_response_status(500);
    }

    
    // Record Activity
    try {
        await record_activity({
            ip_address: clientAddress,
            url: request.url,
            activity_type: ActivityType.UpdateReport,
            user_id: user_data.id
        });
    }
    catch(err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            return create_response_status(400);
        }
        else if(err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }
        
        console.error(`There's an error when trying to add activity record data. Error: ${err}`);
        return create_response_status(500);
    }

    return create_response_status(200);
}