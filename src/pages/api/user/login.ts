import type { APIContext } from "astro";
import { create_response_cookie, create_response_status, generate_user_token, record_activity } from "../../../utils/api_helper";
import cookie from 'cookie';
import { prisma } from "../../../utils/db";
import sha3 from "js-sha3";
import { ActivityType, Prisma } from "@prisma/client";

export async function POST({ request }: APIContext) {
    // Get username and password to check
    const { username, password } = await request.json();
    if(!username || !password) {
        return new Response("", {
            status: 400
        });
    }

    // Get user data
    let user;
    try {
        user = await prisma.users.findFirst({
            where: {
                lowercased_username: {
                    equals: username.toLowerCase(),
                }
            },
        })
    }
    catch(err) {
        if(err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }
        console.error(`There's an error when trying to create report_PIC data : ${err}`);
        return create_response_status(500);
    }
    

    if(!user) {
        return create_response_status(404);
    }

    // Verify password
    if(user.password != sha3.sha3_256(password)) {
        return create_response_status(401);
    }

    // Generate and Send user token
    const user_token = generate_user_token(user.username.toLowerCase());
    const user_token_cookie = cookie.serialize("user_token", user_token, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 2, // 2 hours
    });
    
      
    // Record Activity
    try {
        await record_activity({
            message: "Login to an account",
            url: request.url,
            activity_type: ActivityType.LoginUser,
            user_id: user.id
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
    return create_response_cookie({ role: user.role }, user_token_cookie);
}