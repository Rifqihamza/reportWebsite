import type { APIContext } from "astro";
import { create_response_json, create_response_status, get_cookies_from_request, verify_teacher_token } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";
import { Prisma, type Report } from "@prisma/client";
import { APIResultType } from "../../../utils/api_interface";

export async function GET({ request }: APIContext) {
    // Verify teacher token
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

    // Get the report data
    let report_data: Report[];
    try {
      report_data = await prisma.report.findMany();
    }    
    catch(err) {
      if(err instanceof Prisma.PrismaClientInitializationError) {
          return create_response_status(503);
      }
      console.error(`There's an error when trying to get report data. Error: ${err}`);
      return create_response_status(500);
    }


    // Return the report data
    return create_response_json(report_data);
}