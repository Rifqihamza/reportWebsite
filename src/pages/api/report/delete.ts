import type { APIContext } from "astro";
import { prisma } from "../../../utils/db";
import { create_response_status, get_cookies_from_request, process_server_token, record_activity, verify_user_data_token } from "../../../utils/api_helper";
import { ActivityType, Prisma } from "@prisma/client";
import { APIResultType } from "../../../utils/api_interface";
import { account_to_api_privillage, AccountAPIPrivillage } from "../../../types/variables";

export async function DELETE({ request, clientAddress }: APIContext) {
    // Verify user_token
    const cookies = get_cookies_from_request(request);
      
    const [verification_result, verification_output, user_data] = await verify_user_data_token(cookies ? (cookies["user_token"] ?? "") : "");
    if(!verification_result) {
        if(verification_output === APIResultType.DatabaseError) {
            return create_response_status(503);
        }
        else if(verification_output === APIResultType.InternalServerError) {
            return create_response_status(500);
        }
        
        return create_response_status(401);
    }
      
    // Verify user role
    if(!account_to_api_privillage[user_data.role].includes(AccountAPIPrivillage.DeleteReport)) {
        return create_response_status(401);
    }

    
    // Get the required data
    const { report_id } = await request.json();
    if(!report_id) {
        return create_response_status(400);
    }

    // Check report data
    let report_data;
    try {
        report_data = await prisma.report.findUnique({
            where: {
                id: report_id
            }
        });
    }
    catch(err) {
        if(err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }
        console.error(`There's an error when trying to get report data. Error: ${err}`);
        return create_response_status(500);
    }

    if(!report_data) {
        return create_response_status(404);
    }

    // Delete image if exists
    if(report_data.image) {
        const form_data = new FormData();
        form_data.append("image_location", report_data.image);

        const report_num = (await prisma.report.findMany()).length;
        const server_token = process_server_token(report_num);

        let response;
        try {
            response = await fetch(`${process.env.PHP_SERVER_URL!}/delete_image.php`, {
                method: "POST",
                headers: {
                    "Api-Authorization": process.env.PHP_SERVER_AUTHORIZATION!,
                    "Cookie": `server_token=${server_token}`
                },
                body: form_data
            });
        }
        catch(err) {            
            console.error(`There's an error when trying to request delete image. Error: ${err}`);
            return create_response_status(500);
        }
    
        if(!response.ok) {
            console.error(`There's an error when trying to delete image. Error text: ${await response.text()}`);
            return create_response_status(response.status);
        }
    }
    

    // Delete the data
    try {
        await prisma.report.delete({
            where: {
                id: report_id
            }
        });
    }
    catch(err) {
        if(err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }
        console.error(`There's an error when trying to delete report data. Error: ${err}`);
        return create_response_status(500);
    }
    

    // Record Activity
    try {
        await record_activity({
            ip_address: clientAddress,
            url: request.url,
            activity_type: ActivityType.DeleteReport,
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


    // Return OK
    return create_response_status(200);
}