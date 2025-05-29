import { RateLimiterMemory } from 'rate-limiter-flexible';
import type { MiddlewareHandler } from 'astro';
import { create_response_cookie, create_response_status, first_initialization, verify_captcha_token, verify_user_token } from "./utils/api_helper";
import cookie from 'cookie';

const rateLimiterMemory = new RateLimiterMemory({
    points: 50, // Max 50 requests
    duration: 3600, // Per 1 hour
});

export const onRequest: MiddlewareHandler = async (context, next) => {
    await first_initialization();

    if(context.url.href.includes("api/") && (!context.url.href.includes("/captcha") && !context.url.href.includes("/login"))) {
        // Verify that the user is verifying captcha already
        const captcha_token = context.cookies.get("captcha_token")?.value;
        if(!captcha_token) {
            return create_response_status(511);
        }
        
        // Verify the captcha token
        const result = await verify_captcha_token(captcha_token);
        if(!result) {
            const captcha_cookie = cookie.serialize("captcha_token", "", {
                expires: new Date(),
                path: '/',
                sameSite: 'strict',
                httpOnly: false,
            });
            return create_response_cookie({}, captcha_cookie, 511);
        }

        // Use ratelimiter to the captcha
        try {
            await rateLimiterMemory.consume(captcha_token);
        } catch {
            return create_response_status(429); // stop here
        }

        // Now, Let's verify the user is already log in or not.
        const user_login_token = context.cookies.get("user_token")?.value;
        if(!user_login_token || !verify_user_token(user_login_token)) {
            return create_response_status(401);
        }
    }
    
    
    // Add security layer for response headers
    const response = await next();

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
};
