import type { APIContext } from "astro";
import { apiresult_to_status, create_response_json, create_response_status, get_cache, get_cookies_from_request, set_cache, verify_user_data_token } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";
import { AccountType, ReportLocation_TypeGuard } from "../../../types/variables";
import z from "zod";

export async function GET({ request }: APIContext) {
  // Get the username from cookies
  const cookies = get_cookies_from_request(request);
  if (!cookies || !cookies["user_token"]) {
    return create_response_status(401);
  }

  const [verification_result, verification_output, user_data] = await verify_user_data_token(cookies["user_token"]);
  if (verification_result !== true) {
    return apiresult_to_status(verification_output);
  }

  if (user_data.role !== AccountType.Admin) {
    return create_response_status(401);
  }

  // Get from cache
  let location_data_insecure = await get_cache("cached-locations");

  // If there's no cached data,
  if (location_data_insecure === null) {
    const location_data_db = await prisma.report_Location.findMany();
    location_data_insecure = location_data_db;
    await set_cache("cached-locations", location_data_db, 60 * 60 * 24); // Expire after a week
  }

  // Making sure the returned value is valid
  const location_data_parsed_result = z.array(ReportLocation_TypeGuard).safeParse(location_data_insecure);

  if (!location_data_parsed_result.success) {
    return create_response_status(503);
  }

  const location_data = location_data_parsed_result.data;

  // Return user data
  return create_response_json({
    location_data: location_data
  });
}