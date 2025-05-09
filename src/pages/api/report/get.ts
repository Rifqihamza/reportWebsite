import type { APIContext } from "astro";
import { create_response_json, create_response_status, get_cookies_from_request, verify_user_token } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";
import type { Report } from "@prisma/client";

export async function GET({ request }: APIContext) {
    // Get the report data
    let report_data: Report[];
    try {
        report_data = await prisma.report.findMany();
    }
    catch(err) {
        console.error(`There's an error when trying to get report data. Error: ${err}`);
        return create_response_status(500);
    }


    // Return the report data
    return create_response_json(report_data);
}