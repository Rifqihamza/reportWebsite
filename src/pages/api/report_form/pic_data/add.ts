import type { APIContext } from "astro";
import { create_response_status, verify_teacher_token } from "../../../../utils/api_helper";
import { prisma } from "../../../../utils/db";
import { campuscode_to_campus } from "../../../../types/variables";
import { Prisma } from "@prisma/client";
import { APIResultType } from "../../../../utils/api_interface";

type AddPICRequestBodyType = {
  name?: string,
  campus_code?: string
}

export async function POST({ request, cookies }: APIContext) {
  // Verify the request coming from an admin
  const user_cookies = cookies.get("user_token")?.value;
  
  const verification_result = await verify_teacher_token(user_cookies ?? "");
  if(verification_result !== true) {
    if(verification_result === APIResultType.DatabaseError) {
      return create_response_status(503);
    }
    else if(verification_result === APIResultType.InternalServerError) {
      return create_response_status(500);
    }
    
    return create_response_status(401);
  }
  
  // Get the request body
  const body: AddPICRequestBodyType = await request.json();


  // Verify request body
  if(!body.name) {
    console.log("Body is not valid!");
    return create_response_status(400);
  }

  const verified_campus_name = campuscode_to_campus(body.campus_code);
  if(!verified_campus_name) {
    return create_response_status(400);
  }

  // Add data to Report_PIC table
  try {
    await prisma.report_PIC.create({
      data: {
        name: body.name,
        campus_name: verified_campus_name
      }
    });
  }
  catch(err) {
      if(err instanceof Prisma.PrismaClientInitializationError) {
          return create_response_status(503);
      }
      console.error(`There's an error when trying to create report_PIC data : ${err}`);
      return create_response_status(500);
  }
  

  return create_response_status(200);
}