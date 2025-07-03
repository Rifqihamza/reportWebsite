import type { APIContext } from "astro";
import { create_response_status, record_activity, verify_teacher_token } from "../../../utils/api_helper";
import { APIResultType } from "../../../utils/api_interface";
import { prisma } from "../../../utils/db";
import sha3 from "js-sha3";
import { ActivityType, Prisma } from "@prisma/client";

export async function PUT({ request, cookies }: APIContext) {
  // Get the cookie
  const user_token = cookies.get("user_token")?.value;

  if (!user_token) {
    return create_response_status(401);
  }

  const [verification_result, verification_output, user_data] = await verify_teacher_token(user_token);
  if (verification_result !== true) {
    if (verification_output === APIResultType.DatabaseError) {
      return create_response_status(503);
    }
    else if (verification_output === APIResultType.InternalServerError) {
      return create_response_status(500);
    }

    return create_response_status(401);
  }

  // Verify admin
  if(user_data.role !== "Admin") {
    return create_response_status(401);
  }


  // Get the required data
  const { id, username, password } = await request.json();
  if(!id || !username || !password) {
    return create_response_status(401);
  }


  // Verify the user exists
  try {
    const target_user_data = await prisma.users.findUnique({
      where: {
        id: id
      }
    });
  
    if(!target_user_data) {
      return create_response_status(404);
    }
  }
  catch(err) {
    if(err instanceof Prisma.PrismaClientInitializationError) {
        return create_response_status(503);
    }
    console.error(`There's an error when trying to get user data for verifying user exists: ${err}`);
    return create_response_status(500);
  }

  
  // Update RecordedActivity
  try {
    await record_activity({
      message: "Update a user data",
      url: request.url,
      activity_type: ActivityType.UpdateUser,
      user_id: user_data.id
    })
  }
  catch(err) {
    if(err instanceof Prisma.PrismaClientInitializationError) {
        return create_response_status(503);
    }
    console.error(`There's an error when trying to add activity record data. Error: ${err}`);
    return create_response_status(500);
  }
  

  // Update the user data
  try {
    await prisma.users.update({
      where: {
        id: id
      },
      data: {
        username: username,
        password: sha3.sha3_256(password)
      }
    });
  }
  catch(err) {
    if(err instanceof Prisma.PrismaClientInitializationError) {
        return create_response_status(503);
    }
    console.error(`There's an error when trying to get report data for verification: ${err}`);
    return create_response_status(500);
  }
  

  return create_response_status(200);
}