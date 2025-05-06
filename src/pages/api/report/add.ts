import type { APIContext } from "astro";
import { create_response_status, get_cookies_from_request, verify_teacher_token } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";
import { Prisma } from "@prisma/client";

export async function POST({ request }: APIContext) {
    // Verify teacher token
    const cookies = get_cookies_from_request(request);
    if(!cookies || !cookies["user_token"] || !verify_teacher_token(cookies["user_token"])) {
        return create_response_status(401);
    }

    // Get the required data
    const { message, pic_name, report_type, follow_up, location, report_date, due_date, follow_up_name } = await request.json();

    // Create new report data
    try {
        await prisma.report.create({
            data: {
                message: message,
                follow_up: follow_up,
                follow_up_name: follow_up_name,
                pic_name: pic_name,
                type: report_type,
                location: location,
                report_date: report_date,
                due_date: due_date
            }
        })
    }
    catch(err) {
        if(err instanceof Prisma.PrismaClientValidationError) {
            return create_response_status(400);
        }
        
        console.error(`There's an error when trying to add report data. Error: ${err}`);
        return create_response_status(500);
    }
    

    // Return OK
    return create_response_status(200);
}