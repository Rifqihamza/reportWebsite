import type { APIContext } from "astro";
import { prisma } from "../../../utils/db";
import { create_response_json, create_response_status, get_cookies_from_request, record_activity, verify_admin_token, verify_user_data_token } from "../../../utils/api_helper";
import { ActivityType, Prisma } from "@prisma/client";
import { APIResultType } from "../../../utils/api_interface";
import sha3 from "js-sha3";
import { account_to_api_privillage, AccountAPIPrivillage } from "../../../types/variables";

export async function POST({ request, cookies }: APIContext) {
    // Get the user data
    const { username, password, role } = await request.json();


    // Verify the admin token
    const user_token = cookies.get("user_token")?.value;
    if (!user_token) {
        return create_response_status(401);
    }

    // Check if the user is admin
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

    // Verify user role
    if(!account_to_api_privillage[user_data.role].includes(AccountAPIPrivillage.CreateUser)) {
        return create_response_status(401);
    }


    // Update RecordedActivity
    try {
        await record_activity({
            message: "Create a user data",
            url: request.url,
            activity_type: ActivityType.CreateUser,
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


    // Create new user
    try {
        const created_user_data = await prisma.users.create({
            data: {
                lowercased_username: username.toLowerCase(),
                username: username,
                password: sha3.sha3_256(password),
                role: role
            }
        });

        // Return OK
        return create_response_json(created_user_data);
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            return create_response_status(400);
        }
        else if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return create_response_status(409);
        }
        else if (err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }

        console.error(`There's an error when trying to create user: ${err}`);
        return create_response_status(500);
    }
}