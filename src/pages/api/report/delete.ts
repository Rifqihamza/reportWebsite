import type { APIContext } from "astro";
import { prisma } from "../../../utils/db";
import { create_response_status, get_cookies_from_request, verify_teacher_token } from "../../../utils/api_helper";

export async function DELETE({ request }: APIContext) {
    // Verify user_token
    const cookies = get_cookies_from_request(request);
    if(!cookies || !cookies["user_token"] || !verify_teacher_token(cookies["user_token"])) {
        return create_response_status(401);
    }

    
    // Get the required data
    const { report_id } = await request.json();
    if(!report_id) {
        return create_response_status(400);
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
        console.error(`There's an error when trying to delete report data. Error: ${err}`);
        return create_response_status(500);
    }


    // Return OK
    return create_response_status(200);
}