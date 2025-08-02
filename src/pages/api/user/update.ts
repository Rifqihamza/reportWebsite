import type { APIContext } from "astro";
import { create_response_status, record_activity, verify_user_data_token, create_response_json, create_response_cookie, generate_user_token } from '../../../utils/api_helper';
import { APIResultType } from "../../../utils/api_interface";
import { prisma } from "../../../utils/db";
import sha3 from "js-sha3";
import { ActivityType, Prisma } from "@prisma/client";
import { account_to_api_privillage, AccountAPIPrivillage, User_TypeGuard } from "../../../types/variables";
import cookie from 'cookie';

export async function PUT({ request, cookies, clientAddress }: APIContext) {
  // Get the cookie
  const user_token = cookies.get("user_token")?.value;

  if (!user_token) {
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


  // Get the required data
  const { id, username, password } = await request.json();
  if (!id || (!username && !password) || (typeof username !== "string" || typeof password !== "string")) {
    return create_response_status(401);
  }


  // Verify user role
  if (!account_to_api_privillage[user_data.role].includes(AccountAPIPrivillage.UpdateUser) && (user_data.id !== id || !account_to_api_privillage[user_data.role].includes(AccountAPIPrivillage.SettingProfile))) {
    return create_response_status(401);
  }


  // Verify the user exists
  try {
    const target_user_data = await prisma.users.findUnique({
      where: {
        id: id
      }
    });

    if (!target_user_data) {
      return create_response_status(404);
    }
  }
  catch (err) {
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return create_response_status(503);
    }
    console.error(`There's an error when trying to get user data for verifying user exists: ${err}`);
    return create_response_status(500);
  }


  // Update RecordedActivity
  try {
    await record_activity({
      ip_address: clientAddress,
      url: request.url,
      activity_type: ActivityType.UpdateUser,
      user_id: user_data.id
    });
  }
  catch (err) {
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return create_response_status(503);
    }
    console.error(`There's an error when trying to add activity record data. Error: ${err}`);
    return create_response_status(500);
  }


  // Update the user data
  try {
    const updated_user_data = await prisma.users.update({
      where: {
        id: id
      },
      data: {
        username: username ? username : undefined,
        lowercased_username: username ? username.toLowerCase() : undefined,
        password: password ? sha3.sha3_256(password) : undefined
      }
    });

    const new_user_token = generate_user_token(updated_user_data.username.toLowerCase());
    const new_user_token_cookie = cookie.serialize("user_token", new_user_token, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 2, // 2 hours
    });


    // Parse safely data in order to make sure its data structure
    const safe_parse_result = User_TypeGuard.safeParse(updated_user_data);
    if (!safe_parse_result.success) {
      console.log(`Did you forgot to change the user type guard? error: ${safe_parse_result.error}`);
      return create_response_status(500);
    }

    return create_response_cookie({
      id: updated_user_data.id,
      created_at: updated_user_data.created_at,
      username: updated_user_data.username,
      role: updated_user_data.role,
    }, new_user_token_cookie);
  }
  catch (err) {
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return create_response_status(503); // Database error
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return create_response_status(409); // Conflict
    }
    console.error(`There's an error when trying to get report data for verification: ${err}`);
    return create_response_status(500);
  }
}