// src/pages/api/user/allUsers.ts
import type { APIContext } from "astro";
import { prisma } from "../../../utils/db";
import {
    get_cookies_from_request,
    verify_user_token,
    create_response_status,
    create_response_json,
} from "../../../utils/api_helper";

export async function GET({ request }: APIContext) {
    const cookies = get_cookies_from_request(request);
    const token = cookies?.["user_token"];
    if (!token) return create_response_status(401);

    const username = verify_user_token(token);
    if (!username) return create_response_status(401);

    const users = await prisma.users.findMany({
        where: {
            NOT: {
                role: "Admin"
            }
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            created_at: true,
        },
    });

    return create_response_json(users);
}
