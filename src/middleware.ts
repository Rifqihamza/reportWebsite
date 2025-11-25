import { RateLimiterMemory } from 'rate-limiter-flexible';
import type { MiddlewareHandler } from 'astro';
import { check_database_connection, create_response_cookie, create_response_status, first_initialization, verify_captcha_token, verify_user_data_token } from "./utils/api_helper";

const rateLimiterMemory = new RateLimiterMemory({
    points: 50, // Max 50 requests
    duration: 3600, // Per 1 hour
});

export const onRequest: MiddlewareHandler = async (context, next) => {
    await first_initialization();
    console.log(context.url.href);

    if (context.url.href.includes("api/") && !(await check_database_connection())) {
        return create_response_status(503);
    }

    if (context.url.href.includes("api/") && (!context.url.href.includes("/captcha") && !context.url.href.includes("/login"))) {
        // Now, Let's verify the user is already log in or not.
        const user_login_token = context.cookies.get("user_token")?.value;
        if (!user_login_token) {
            return create_response_status(401);
        }

        const [verification_result, verification_output, user_data] = await verify_user_data_token(user_login_token);
        if (!verification_result || user_data.inactive) {
            return create_response_status(401);
        }


        // Use ratelimiter to the user id
        try {
            await rateLimiterMemory.consume(user_data.id);
            const res = await rateLimiterMemory.get(user_data.id);
        } catch {
            return create_response_status(429); // stop here
        }
    }


    // Add security layer for response headers
    const response = await next();

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
};
