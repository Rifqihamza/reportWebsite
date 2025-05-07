import type { APIContext } from "astro";
import { create_response_json, create_response_status, first_initialization, get_cookies_from_request, verify_user_token } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";

export async function GET({ request }: APIContext) {
    await first_initialization();

    // Get cookies
    const cookies = get_cookies_from_request(request)

    // Verify user token
    if(!cookies || !cookies["user_token"] || !verify_user_token(cookies["user_token"])) {
        return create_response_status(401);
    }

    // Get the PIC data
    const pic_data = await prisma.users.findMany();


    // Return the PIC data
    return create_response_json(pic_data);
}