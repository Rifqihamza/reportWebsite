import type { APIContext } from "astro";
import { apiresult_to_status, create_response_json, create_response_status, get_cookies_from_request, verify_user_data_token } from "../../../utils/api_helper";
import { User_TypeGuard } from "../../../types/variables";

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

    // Parse safely data in order to make sure its data structure
    const safe_parse_result = User_TypeGuard.safeParse(user_data);
    if(!safe_parse_result.success) {
        console.log(`Did you forgot to change the user type guard? error: ${safe_parse_result.error}`);
        return create_response_status(500);
    }

    // Return user data
    return create_response_json(user_data);
}