import type { APIContext } from "astro";
import { apiresult_to_status, create_response_json, create_response_status, get_cookies_from_request, verify_user_data_token } from "../../../utils/api_helper";
import { redisClient } from "../../../utils/redis";
import { prisma } from "../../../utils/db";
import { UserResponsibleLocation_TypeGuard } from "../../../types/variables";
import z from "zod";

export async function GET({ request }: APIContext) {
    // Get the username from cookies
    const cookies = get_cookies_from_request(request);
    if (!cookies || !cookies["user_token"]) {
        return create_response_status(401);
    }

    const [verification_result, verification_output, user_data] = await verify_user_data_token(cookies["user_token"]);
    if (verification_result !== true) {
        return apiresult_to_status(verification_output)
    }

    // Get the status if they're a PIC or not

    // Get from cache
    const redis = await redisClient;
    let user_responsible_locations_data_json = await redis.get("cached-user-responsible-locations");

    // If there's no cached data,
    if(user_responsible_locations_data_json === null) {
        const user_responsible_locations_data_db = await prisma.userResponsibleLocation.findMany();
        user_responsible_locations_data_json = JSON.stringify(user_responsible_locations_data_db);
        await redis.set("cached-user-responsible-locations", user_responsible_locations_data_json);
    }

    // Get the responsible locations data
    const user_responsible_locations_data_insecure: any = JSON.parse(user_responsible_locations_data_json);

    // Making sure the returned value is valid
    const user_responsible_locations_data_parsed_result = z.array(UserResponsibleLocation_TypeGuard).safeParse(user_responsible_locations_data_insecure);

    if(!user_responsible_locations_data_parsed_result.success) {
        return create_response_status(402);
    }

    const user_responsible_locations_data = user_responsible_locations_data_parsed_result.data;



    // Return user data
    return create_response_json({
        user_data: user_data,
        is_pic: user_responsible_locations_data.find((data) => data.responsible_user_name == user_data.username)
    });
}