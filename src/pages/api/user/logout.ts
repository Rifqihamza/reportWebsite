import type { APIContext } from "astro";
import { create_response_cookie, create_response_status, record_activity, verify_user_token } from "../../../utils/api_helper";
import cookie from 'cookie';
import { ActivityType, Prisma } from "@prisma/client";
import { prisma } from "../../../utils/db";

export async function POST({request, cookies}: APIContext) {
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
    
    return create_response_cookie({}, clear_user_token_cookie);
}