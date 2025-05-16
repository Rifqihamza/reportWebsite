import type { APIContext } from "astro";
import { create_response_json, create_response_status, get_cookies_from_request, verify_user_token } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";

export async function GET({ request }: APIContext) {
    // Get the username from cookies
    const cookies = get_cookies_from_request(request);
    if(!cookies || !cookies["user_token"]) {
        return create_response_status(401);
    }

    const username = verify_user_token(cookies["user_token"]);
    if(!username) {
        return create_response_status(401);
    }


    // Get and verify user data
    const user_data = await prisma.users.findUnique({
        where: {
            username: username
        }
    });

    if(!user_data) {
        return create_response_status(404);
    }


    // Return user data
    return create_response_json(user_data);
}