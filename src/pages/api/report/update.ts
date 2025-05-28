import type { APIContext } from "astro";
import { create_response_status, get_cookies_from_request, verify_teacher_token } from "../../../utils/api_helper";
import type { ReportData } from "../../../types/variables";
import { prisma } from "../../../utils/db";

export async function PUT({ request }: APIContext) {
    // Verify user_token
    const cookies = get_cookies_from_request(request);
    if(!cookies || !cookies["user_token"] || !verify_teacher_token(cookies["user_token"])) {
        return create_response_status(401);
    }

    // Get the required data
    const { report_id, report_data: new_report_data }: { report_id: string, report_data: ReportData } = await request.json();
    if(!report_id || !new_report_data) {
        return create_response_status(400);
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
                pic_name: new_report_data.pic_name ?? undefined,
                type: new_report_data.type ?? undefined,
                status: new_report_data.status ?? undefined,
                location: new_report_data.location ?? undefined,
                follow_up: new_report_data.follow_up || undefined,
                follow_up_name: new_report_data.follow_up_name ?? undefined,
                report_date: new_report_data.report_date ?? undefined,
                due_date: new_report_data.due_date === "" ? null : (new_report_data.due_date || undefined),
            }
        });
    }
    catch(err) {
        console.error(`There's an error when trying to update report data: ${err}`);
        return create_response_status(500);
    }

    return create_response_status(200);
}