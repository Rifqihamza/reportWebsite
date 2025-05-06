import type { APIContext } from "astro";
import { prisma } from "../../../utils/db";
import { create_response_status, get_cookies_from_request, verify_teacher_token } from "../../../utils/api_helper";

export async function PUT({ request }: APIContext) {
    // Verify user_token
    const cookies = get_cookies_from_request(request);
    if(!cookies || !cookies["user_token"] || !verify_teacher_token(cookies["user_token"])) {
        return create_response_status(401);
    }
    
    
    // Get the required data
    const { report_id, report_status } = await request.json();
    if(!report_id || !report_status) {
        return create_response_status(400);
    }


    // Delete the data
    try {
        await prisma.report.update({
            where: {
                id: report_id
            },
            data: {
                status: report_status
            }
        });
    }
    catch(err) {
        console.error(`There's an error when trying to delete report data. Error: ${err}`);
        return create_response_status(500);
    }


    // Return OK
    return create_response_status(200);
}