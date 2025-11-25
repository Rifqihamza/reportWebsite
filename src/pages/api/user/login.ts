import type { APIContext } from "astro";
import { create_response_cookie, create_response_status, generate_user_token, record_activity } from "../../../utils/api_helper";
import cookie from 'cookie';
import { prisma } from "../../../utils/db";
import sha3 from "js-sha3";
import { ActivityType, Prisma } from "@prisma/client";
import z from "zod";

const post_request_object = z.object({
    username: z.string(),
    password: z.string()
});


export async function POST({ request, clientAddress }: APIContext) {
    // Get username and password to check
    const optional_data = post_request_object.safeParse(await request.json());
    if(!optional_data.success) {
        return new Response("", {
            status: 400
        });
    }
    
    const { username, password } = optional_data.data;
    if(!username || !password) {
        return new Response("", {
            status: 400
        });
    }

    // Get user data
    let user;
    try {
        user = await prisma.users.findUnique({
            where: {
                lowercased_username: username.toLowerCase()
            }
        })
    }
    catch(err) {
        if(err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }
        console.error(`There's an error when trying to get user data : ${err}`);
        return create_response_status(500);
    }
    

    // Verify existance
    if(!user || user.inactive) {
        return create_response_status(401);
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
            ip_address: clientAddress,
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