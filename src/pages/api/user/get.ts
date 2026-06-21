import type { APIContext } from "astro";
import { apiresult_to_status, create_response_json, create_response_status, get_cache, get_cookies_from_request, set_cache, verify_user_data_token } from "../../../utils/api_helper";
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
    let user_responsible_locations_data_insecure = await get_cache("cached-user-responsible-locations");

    // If there's no cached data,
    if(user_responsible_locations_data_insecure === null) {
        const user_responsible_locations_data_db = await prisma.userResponsibleLocation.findMany();
        user_responsible_locations_data_insecure = user_responsible_locations_data_db;
        await set_cache("cached-user-responsible-locations", user_responsible_locations_data_db, 60*60*24); // Expire after a day
    }

    // Making sure the returned value is valid
    const user_responsible_locations_data_parsed_result = z.array(UserResponsibleLocation_TypeGuard).safeParse(user_responsible_locations_data_insecure);

    if (!user_responsible_locations_data_parsed_result.success) {
        return create_response_status(503);
    }

    const user_responsible_locations_data = user_responsible_locations_data_parsed_result.data;

    // Return user data
    return create_response_json({
        user_data: user_data,
        responsible_location: user_responsible_locations_data.find((data) => data.responsible_user_name == user_data.username)?.location ?? null
    });
}