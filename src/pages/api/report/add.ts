import type { APIContext } from "astro";
import { create_response_json, create_response_status, process_server_token, record_activity, verify_user_token } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";
import { Prisma, type Report, type Report_Location, ActivityType } from "@prisma/client";
import { ReportType, string_to_campus } from "../../../types/variables";
import { z } from 'zod';


const ReportBodyType = z.object({
    submitted_by: z.string(),
    message: z.string(),
    report_type: z.nativeEnum(ReportType),
    location: z.string(),
    detail_location: z.string().optional(),
    report_date: z.string(),
    image: z.instanceof(File).optional(),
    campus: z.string(),
});

export async function POST({ request, cookies }: APIContext) {
    const user_token = cookies.get("user_token")?.value;
    const username = verify_user_token(user_token??"");

    // If the token invalid
    if(!username) {
        return create_response_status(401);
    }

    const user_data = await prisma.users.findUnique({
        where: {
            username: username
        }
    });
    
    // If the user data is not found
    if(!user_data) {
        return create_response_status(404);
    }

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
        report_type,
        location,
        report_date,
        image,
        detail_location,
        campus
    } = parsed_result.data;


    const verified_campus_name = string_to_campus(campus);

    if (!verified_campus_name) {
        console.log(`Campus name is not valid!`);
        return create_response_status(400);
    }



    // Verify location
    if (location) {
        let location_data: Report_Location | null = null;
        if (verified_campus_name) {
            try {
                location_data = await prisma.report_Location.findUnique({
                    where: {
                        location_campus_name: {
                            location: location,
                            campus_name: verified_campus_name
                        }
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
        }

        if (!location_data) {
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


        let response;
        try {
            response = await fetch(`${process.env.PHP_SERVER_URL!}/upload_image.php`, {
                method: "POST",
                headers: {
                    "Api-Authorization": process.env.PHP_SERVER_AUTHORIZATION!,
                    "Cookie": `server_token=${server_token}`
                },
                body: form_data
            });
        }
        catch(err) {
            console.error(`There's an error when trying to get report data. Error: ${err}`);
            return create_response_status(500);
        }

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
                report_location: {
                    connect: {
                        location_campus_name: {
                            location: location,
                            campus_name: verified_campus_name
                        }
                    }
                },
                type: report_type,
                report_date: report_date,
                image: image_file_path,
                detail_location: detail_location,
                campus: verified_campus_name
            }
        })
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            return create_response_status(400);
        }
        else if(err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }
        
        console.error(`There's an error when trying to add report data. Error: ${err}`);
        return create_response_status(500);
    }

    
    // Record Activity
    try {
        await record_activity({
            message: "Add a report data",
            url: request.url,
            activity_type: ActivityType.CreateReport,
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
    // return create_response_status(200);
    return create_response_json(report_data);
}