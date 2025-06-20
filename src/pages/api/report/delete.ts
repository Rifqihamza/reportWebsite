import type { APIContext } from "astro";
import { prisma } from "../../../utils/db";
import { create_response_status, get_cookies_from_request, process_server_token, verify_teacher_token } from "../../../utils/api_helper";
import { Prisma } from "@prisma/client";
import { APIResultType } from "../../../utils/api_interface";

export async function DELETE({ request }: APIContext) {
    // Verify user_token
    const cookies = get_cookies_from_request(request);
      
    const verification_result = await verify_teacher_token(cookies ? (cookies["user_token"] ?? "") : "");
    if(verification_result !== true) {
        if(verification_result === APIResultType.DatabaseError) {
            return create_response_status(503);
        }
        else if(verification_result === APIResultType.InternalServerError) {
            return create_response_status(500);
        }
        
        return create_response_status(401);
    }

    
    // Get the required data
    const { report_id } = await request.json();
    if(!report_id) {
        return create_response_status(400);
    }

    // Check report data
    let report_data;
    try {
        report_data = await prisma.report.findUnique({
            where: {
                id: report_id
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

    if(!report_data) {
        return create_response_status(404);
    }

    // Delete image if exists
    if(report_data.image) {
        const form_data = new FormData();
        form_data.append("image_location", report_data.image);

        const report_num = (await prisma.report.findMany()).length;
        const server_token = process_server_token(report_num);

        let response;
        try {
            response = await fetch(`${process.env.PHP_SERVER_URL!}/delete_image.php`, {
                method: "POST",
                headers: {
                    "Api-Authorization": process.env.PHP_SERVER_AUTHORIZATION!,
                    "Cookie": `server_token=${server_token}`
                },
                body: form_data
            });
        }
        catch(err) {            
            console.error(`There's an error when trying to request delete image. Error: ${err}`);
            return create_response_status(500);
        }
    
        if(!response.ok) {
            console.error(`There's an error when trying to delete image. Error text: ${await response.text()}`);
            return create_response_status(response.status);
        }
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
        if(err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }
        console.error(`There's an error when trying to delete report data. Error: ${err}`);
        return create_response_status(500);
    }


    // Return OK
    return create_response_status(200);
}