import type { APIContext } from "astro";
import { create_response_json, create_response_status, verify_user_data_token } from "../../../utils/api_helper";
import { APIResultType } from "../../../utils/api_interface";
import { prisma } from "../../../utils/db";
import { Prisma } from "@prisma/client";

export async function DELETE({ request, cookies }: APIContext) {
  // Verify user token
  const user_token = cookies.get("user_token")?.value;
  if(!user_token) {
    return create_response_status(401);
  }

  const [verification_result, verification_output, user_data] = await verify_user_data_token(user_token);
  if (verification_result !== true) {
    if (verification_output === APIResultType.DatabaseError) {
      return create_response_status(503);
    }
    else if (verification_output === APIResultType.InternalServerError) {
      return create_response_status(500);
    }

    return create_response_status(401);
  }

  if(user_data.role !== "Admin") {
    return create_response_status(401);
  }


  // Get the required data
  const { id } = await request.json();


  // Verify the user exists
  try {
    const user_data = await prisma.users.findUnique({
      where: {
        id: id
      }
    });

    if(!user_data) {
      return create_response_status(401);
    }
  }
  catch(err) {
      if(err instanceof Prisma.PrismaClientInitializationError) {
          return create_response_status(503);
      }
      console.error(`There's an error when trying to get user data for verifying user exists: ${err}`);
      return create_response_status(500);
  }


  // Delete the user
  try {
    const result = await prisma.users.update({
      where: {
        id: id
      },
      data: {
        inactive: true
      }
    });
    
    return create_response_json(result);
  }
  catch(err) {
      if(err instanceof Prisma.PrismaClientInitializationError) {
          return create_response_status(503);
      }

      console.error(`There's an error when trying to delete user data: ${err}`);
      return create_response_status(500);
  }
}