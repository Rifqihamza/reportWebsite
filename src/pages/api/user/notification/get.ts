import type { APIContext } from "astro";
import { apiresult_to_status, create_response_json, create_response_status, get_cookies_from_request, verify_user_data_token } from "../../../../utils/api_helper";
import { redisClient } from "../../../../utils/redis";
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
      const redis = await redisClient;
      const cached_notifications_data_json = await redis.get(`cached-notifications-${user_data.username}`);
      const cached_notifications_data: any = JSON.parse(cached_notifications_data_json ?? "[0]");
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
            await redis.setEx(`cached-notifications-${user_data.username}`, 60, JSON.stringify(notifications_data)); // Expire in minute
      }
      // Return user data
      return create_response_json({
            notifications: notifications_data
      });
}