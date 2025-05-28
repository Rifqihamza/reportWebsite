import type { APIContext } from "astro";
import { create_response_json, create_response_status, get_cookies_from_request, process_server_token, verify_recaptcha_token, verify_teacher_token } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";
import { Prisma, type Report } from "@prisma/client";
import { AccountType, ReportType } from "../../../types/variables";
import { z } from 'zod';


const ReportBodyType = z.object({
    submitted_by: z.string(),
    message: z.string(),
    pic_name: z.string().optional(),
    report_type: z.nativeEnum(ReportType),
    follow_up: z.nativeEnum(AccountType).optional(),
    location: z.string(),
    report_date: z.string(),
    due_date: z.string().optional(),
    follow_up_name: z.string().optional(),
    image: z.instanceof(File).optional(),
});

export async function POST({ request }: APIContext) {
    // Get the required data
    let result: {
        [key: string]: string | object | File
    } = {};
    for (const [key, value] of (await request.formData()).entries()) {
        if (key == "image" && value instanceof File) {
            result[key] = value;
            continue;
        }

        result[key] = value.valueOf();
    }

    const parsed_result = ReportBodyType.safeParse(result);
    if (!parsed_result.success) {
        console.log("Request data is not complete!");
        return create_response_status(400);
    }

    // Verify the body data
    const {
        submitted_by,
        message,
        pic_name,
        report_type,
        follow_up,
        location,
        report_date,
        due_date,
        follow_up_name,
        image
    } = parsed_result.data;

    // Check if user is teacher if it includes due date and follow up data
    if(follow_up || follow_up_name || due_date) {
        const cookies = get_cookies_from_request(request);
        
        if(!cookies || !cookies["user_token"] || !(await verify_teacher_token(cookies["user_token"]))) {
            console.log("User JWT Token is not valid!");
            return create_response_status(401);
        }
    }

    
    // Verify PIC name and Location
    if(pic_name) {
        const pic_data = await prisma.report_PIC.findUnique({
            where: {
                name: pic_name
            }
        });
    
        if(!pic_data) {
            console.log("PIC Name is not valid!");
            return create_response_status(400);
        }
    }
    
    if(location) {
        const location_data = await prisma.report_Location.findUnique({
            where: {
                location: location
            }
        });
    
        if(!location_data) {
            console.log("Location is not valid!");
            return create_response_status(400);
        }
    }
    
    
    // Upload file if image exists
    let image_file_path = "";

    if (image) {
        console.log("Sending Image...");
        if (image.size > 5 * 1024 * 1024) {
            console.log("Image size is too large!");
            return create_response_status(413);
        }

        if (!image.type.startsWith('image/')) {
            console.log("Image file type is not recognized as an image!");
            return create_response_status(415);
        }

        const form_data = new FormData();
        form_data.append("image", image);
        form_data.append("test", "test");

        const report_num = (await prisma.report.findMany()).length;
        const server_token = process_server_token(report_num);


        const response = await fetch(`${process.env.PHP_SERVER_URL!}/upload_image.php`, {
            method: "POST",
            headers: {
                "Api-Authorization": process.env.PHP_SERVER_AUTHORIZATION!,
                "Cookie": `server_token=${server_token}`
            },
            body: form_data
        });

        image_file_path = await response.text();

        if (!response.ok) {
            console.error(`Error from PHP Server : ${image_file_path}`);
            return create_response_status(response.status);
        }

        if (typeof image_file_path != "string") {
            console.error(`The file path that php server gave is not a string!`);
            return create_response_status(500);
        }
    }


    // Create new report data
    let report_data: Report | null;
    try {
        report_data = await prisma.report.create({
            data: {
                submitted_by: submitted_by,
                message: message,
                follow_up: follow_up,
                follow_up_name: follow_up_name,
                responsible_pic: pic_name ? {
                    connect: {
                        name: pic_name
                    },
                } : undefined,
                report_location: {
                    connect: {
                        location: location
                    }
                },
                type: report_type,
                report_date: report_date,
                due_date: due_date,
                image: image_file_path
            }
        })
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            return create_response_status(400);
        }

        console.error(`There's an error when trying to add report data. Error: ${err}`);
        return create_response_status(500);
    }


    // Return OK
    // return create_response_status(200);
    return create_response_json(report_data);
}