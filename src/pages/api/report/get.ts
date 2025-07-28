import type { APIContext } from "astro";
import { create_response_json, create_response_status, get_cookies_from_request, record_activity, verify_user_data_token } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";
import { ActivityType, Prisma, type Report } from "@prisma/client";
import { APIResultType } from "../../../utils/api_interface";
import { account_to_api_privillage, AccountAPIPrivillage, ReportData_TypeGuard } from "../../../types/variables";

export async function GET({ request }: APIContext) {
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


    // Get the required body parameters
    const searchParams = (new URL(request.url)).searchParams;
    const page = Number.parseInt(searchParams.get("page") ?? "0");
    const limit = Number.parseInt(searchParams.get("limit") ?? "0");
    if (page <= 0 || limit <= 0) {
        return create_response_status(400);
    }

    // Get the report data
    let report_data: Report[];
    try {
        report_data = await prisma.report.findMany({
            orderBy: {
                created_at: "desc"
            },
        });

        // Parse safely data in order to make sure its data structure
        const safe_parse_result = ReportData_TypeGuard.safeParse(report_data[0]);
        if (!safe_parse_result.success) {
            console.log(`Did you forgot to change the report data type guard? error: ${safe_parse_result.error}`);
            return create_response_status(500);
        }
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }
        console.error(`There's an error when trying to get report data. Error: ${err}`);
        return create_response_status(500);
    }

    // Record Activity
    try {
        await record_activity({
            message: "Get all report data",
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

    const max_page = Math.ceil(report_data.length / limit);
    const sliced_report_data = report_data.slice(page * limit, Math.min(report_data.length - 1, (page + 1) * limit));

    // Return the report data
    return create_response_json({
        max_page: max_page,
        report_data: sliced_report_data
    });
}