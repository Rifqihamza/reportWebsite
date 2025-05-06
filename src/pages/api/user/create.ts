import type { APIContext } from "astro";
import { prisma } from "../../../utils/db";
import { create_response_status, first_initialization, get_cookies_from_request, verify_admin_token } from "../../../utils/api_helper";
import { type AccountType, Prisma } from "@prisma/client";

export async function POST({ request }: APIContext) {
    await first_initialization();

    // Get the user data
    const { email, username, password, role } = await request.json();


    // Verify the admin token
    const request_cookies = get_cookies_from_request(request);
    if(!request_cookies || !verify_admin_token(request_cookies["admin_token"])) {
        return create_response_status(401);
    }


    // Create new user
    try {
        await prisma.users.create({
            data: {
                email: email,
                username: username,
                password: password,
                role: role
            }
        });
    }
    catch(err) {
        if(err instanceof Prisma.PrismaClientValidationError) {
            return create_response_status(400);
        }
        else if(err instanceof Prisma.PrismaClientKnownRequestError) {
            return create_response_status(409)
        }
        
        console.error(`There's an error when trying to create user: ${err}`);
        return create_response_status(500);
    }
    
    
    // Return OK
    return create_response_status(200);
}