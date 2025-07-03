import type { APIContext } from "astro";
import { create_response_cookie, create_response_status, record_activity, verify_user_data_token } from "../../../utils/api_helper";
import cookie from 'cookie';
import { ActivityType, Prisma } from "@prisma/client";
import { APIResultType } from "../../../utils/api_interface";

export async function POST({ request, cookies }: APIContext) {
    const user_token = cookies.get("user_token")?.value;
    const [is_verified, error_code, user_data] = await verify_user_data_token(user_token ?? "");

    // If the token invalid
    if (!is_verified) {
        if (error_code === APIResultType.DatabaseError) {
            return create_response_status(503);
        }
        else if (error_code === APIResultType.InternalServerError) {
            return create_response_status(500);
        }

        return create_response_status(401);
    }


    const clear_user_token_cookie = cookie.serialize("user_token", "", {
        expires: new Date(),
        path: '/',
        sameSite: 'strict',
        httpOnly: false,
    });


    // Record Activity
    try {
        await record_activity({
            message: "Logout from an account",
            url: request.url,
            activity_type: ActivityType.LogoutUser,
            user_id: user_data.id
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            return create_response_status(400);
        }
        else if (err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }

        console.error(`There's an error when trying to add activity record data. Error: ${err}`);
        return create_response_status(500);
    }

    return create_response_cookie({}, clear_user_token_cookie);
}