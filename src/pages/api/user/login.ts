import type { APIContext } from "astro";
import { create_response_cookie, create_response_status, first_initialization, generate_user_token } from "../../../utils/api_helper";
import cookie from 'cookie';
import { prisma } from "../../../utils/db";

export async function POST({ request }: APIContext) {
    await first_initialization();
    
    // Get username and password to check
    const { username, password } = await request.json();
    if(!username || !password) {
        return new Response("", {
            status: 400
        });
    }

    // Get user data
    const user = await prisma.users.findUnique({
        where: {
            username: username,
        }
    })

    if(!user) {
        return create_response_status(404);
    }

    // Verify password
    if(user.password != password) {
        return create_response_status(401);
    }

    // Generate and Send user token
    const user_token = generate_user_token(user.username);
    const user_token_cookie = cookie.serialize("user_token", user_token, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
    });

    // Return OK
    return create_response_cookie({}, user_token_cookie);
}