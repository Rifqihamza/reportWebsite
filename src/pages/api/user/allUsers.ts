// src/pages/api/user/allUsers.ts
import type { APIContext } from "astro";
import { prisma } from "../../../utils/db";
import {
    get_cookies_from_request,
    create_response_status,
    create_response_json,
    verify_user_data_token,
    apiresult_to_status,
} from "../../../utils/api_helper";
import { Prisma } from "@prisma/client";

export async function GET({ request }: APIContext) {
    const cookies = get_cookies_from_request(request);
    const token = cookies?.["user_token"];
    if (!token) return create_response_status(401);

    const [verification_result, verification_output, user_data] = await verify_user_data_token(token);
    if(!verification_result) {
        return apiresult_to_status(verification_output);
    }

    let users;
    try {
        users = await prisma.users.findMany({
            where: {
                NOT: {
                    role: "Admin",
                },
                inactive: false
            },
            select: {
                id: true,
                username: true,
                role: true,
                created_at: true,
            },
        });
    }
    catch(err) {
        if(err instanceof Prisma.PrismaClientInitializationError) {
            return create_response_status(503);
        }
        console.error(`There's an error when trying to create report_PIC data : ${err}`);
        return create_response_status(500);
    }

    return create_response_json(users);
}
