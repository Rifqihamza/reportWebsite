import type { APIContext } from "astro";
import { create_response_json, create_response_status, get_cache, get_cookies_from_request, record_activity, set_cache, verify_user_data_token } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";
import { ActivityType, Prisma, type Report } from "@prisma/client";
import { APIResultType } from "../../../utils/api_interface";
import { account_to_api_privillage, AccountAPIPrivillage, ReportData_TypeGuard } from "../../../types/variables";
import { z } from "zod";

export async function GET({ request, clientAddress }: APIContext) {
    // Verify user token
    const cookies = get_cookies_from_request(request);

    const [verification_result, verification_output, user_data] = await verify_user_data_token(cookies ? (cookies["user_token"] ?? "") : "");
    if (!verification_result) {
        if (verification_output === APIResultType.DatabaseError) {
            return create_response_status(503);
        }
        else if (verification_output === APIResultType.InternalServerError) {
            return create_response_status(500);
        }

        return create_response_status(401);
    }


    // Verify user role
    if (!account_to_api_privillage[user_data.role].includes(AccountAPIPrivillage.GetReport)) {
        return create_response_status(401);
    }


    // Get the report data
    let report_data: Report[];

    // Get cache
    const cached_report_data = await get_cache("cached-report-data") ?? [0];
    const parsed_cached_report_data = z.array(ReportData_TypeGuard).safeParse(cached_report_data);
    if(parsed_cached_report_data.success) {
        report_data = parsed_cached_report_data.data as Report[];
    }

    // Get data straight to database
    else {
        try {
            report_data = await prisma.report.findMany();
            await set_cache("cached-report-data", report_data, 60*60);
        }
        catch (err) {
            if (err instanceof Prisma.PrismaClientInitializationError) {
                return create_response_status(503);
            }
            console.error(`There's an error when trying to get report data. Error: ${err}`);
            return create_response_status(500);
        }
    }
    

    // Record Activity
    try {
        await record_activity({
            ip_address: clientAddress,
            url: request.url,
            activity_type: ActivityType.GetReport,
            user_id: user_data.id
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            return create_response_status(400);
        }
        else if (err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }

        console.error(`There's an error when trying to add activity record data. Error: ${err}`);
        return create_response_status(500);
    }


    // Return the report data
    return create_response_json(report_data);
}