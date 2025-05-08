import type { APIContext } from "astro";
import { create_response_json, create_response_status, get_cookies_from_request, php_server_url, verify_teacher_token } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";
import { Prisma, type Report } from "@prisma/client";
import { AccountType, ReportType } from "../../../types/variables";
import { z } from 'zod';

const ReportBodyType = z.object({
    message: z.string(),
    pic_name: z.string(),
    report_type: z.nativeEnum(ReportType),
    follow_up: z.nativeEnum(AccountType),
    location: z.string(),
    report_date: z.string(),
    due_date: z.string(),
    follow_up_name: z.string(),
    image: z.instanceof(File)
});

export async function POST({ request }: APIContext) {
    
    // Verify teacher token
    const cookies = get_cookies_from_request(request);
    if(!cookies || !cookies["user_token"] || !verify_teacher_token(cookies["user_token"])) {
        return create_response_status(401);
    }


    // Get the required data
    let result: {
        [key: string]: string | object | File
    } = {};
    for (const [key, value] of (await request.formData()).entries()) {
        if(key == "image" && value instanceof File) {
            result[key] = value;
            continue;
        }
        
        result[key] = value.valueOf();
    }
    
    const parsed_result = ReportBodyType.safeParse(result);
    if(!parsed_result.success) {
        return create_response_status(400);
    }

    const { message, pic_name, report_type, follow_up, location, report_date, due_date, follow_up_name, image } = parsed_result.data;

    
    // Upload file if image exists
    let image_file_path = "";

    if(image) {
        console.log("Sending Image...");
        if(image.size > 10 * 1024 * 1024) {
            return create_response_status(413);
        }
        
        if (!image.type.startsWith('image/')) {
            return create_response_status(415);
        }

        const form_data = new FormData();
        form_data.append("image", image);
        form_data.append("test", "test");

        const response = await fetch(php_server_url, {
            method: "POST",
            headers: {
                "Authorization": process.env.PHP_SERVER_AUTHORIZATION!
            },
            body: form_data
        });

        image_file_path = await response.text();
        
        if(!response.ok) {
            return create_response_status(response.status);
        }
        
        if(typeof image_file_path != "string") {
            console.error(`The file path that php server gave is not a string!`);
            return create_response_status(500);
        }
    }
    

    // Create new report data
    let report_data: Report|null;
    try {
        report_data = await prisma.report.create({
            data: {
                message: message,
                follow_up: follow_up,
                follow_up_name: follow_up_name,
                pic_name: pic_name,
                type: report_type,
                location: location,
                report_date: report_date,
                due_date: due_date,
                image: image_file_path
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
    // return create_response_status(200);
    return create_response_json(report_data);
}