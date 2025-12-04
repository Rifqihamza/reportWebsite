import type { APIContext } from "astro";
import { apiresult_to_status, create_response_status, del_cache, get_cookies_from_request, verify_user_data_token } from "../../../../utils/api_helper";
import { prisma } from "../../../../utils/db";
import z from "zod";

const bodyType = z.strictObject({
      notification_id: z.string()
});

export async function POST({ request }: APIContext) {
      // Get the username from cookies
      const cookies = get_cookies_from_request(request);
      if (!cookies || !cookies["user_token"]) {
            return create_response_status(401);
      }

      const [verification_result, verification_output, user_data] = await verify_user_data_token(cookies["user_token"]);
      if (verification_result !== true) {
            return apiresult_to_status(verification_output)
      }

      // Get the notification that the user read from request body
      const body_data = await request.json();
      const safe_result_body_data = bodyType.safeParse(body_data);
      if(!safe_result_body_data.success) return create_response_status(400);
      const { notification_id } = safe_result_body_data.data;

      // Remove the cache
      await del_cache(`cached-notifications-${user_data.username}`);

      // Update the cached notifications
      try {
            await prisma.notification.updateMany({
                  data: {
                        isNew: false,
                  },
                  where: {
                        id: notification_id,
                        account: {
                              id: user_data.id
                        }
                  }
            })
      }
      catch(err) {
            console.error(`There's an error when trying to update the notification status to not new. Error: ${err}`);
            return create_response_status(500);
      }

      return create_response_status(200);
}