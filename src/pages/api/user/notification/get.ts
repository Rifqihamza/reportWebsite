import type { APIContext } from "astro";
import { apiresult_to_status, create_response_json, create_response_status, get_cache, get_cookies_from_request, set_cache, verify_user_data_token } from "../../../../utils/api_helper";
import { prisma } from "../../../../utils/db";
import { Notification_TypeGuard, UserResponsibleLocation_TypeGuard } from "../../../../types/variables";
import z from "zod";
import type { Notification } from "@prisma/client";

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

      // Get the status if they're a PIC or not

      // Get from cache
      const cached_notifications_data = await get_cache(`cached-notifications-${user_data.username}`) ?? [0];
      const cached_notifications_data_parsed = z.array(Notification_TypeGuard).safeParse(cached_notifications_data);

      let notifications_data: Notification[] = [];
      if (cached_notifications_data_parsed.success) {
            notifications_data = cached_notifications_data_parsed.data;
      }
      else {
            notifications_data = await prisma.notification.findMany({
                  where: {
                        account: {
                              id: user_data.id
                        }
                  }
            });
            await set_cache(`cached-notifications-${user_data.username}`, notifications_data, 60);
      }
      // Return user data
      return create_response_json({
            notifications: notifications_data
      });
}