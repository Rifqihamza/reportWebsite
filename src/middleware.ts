import { RateLimiterMemory } from 'rate-limiter-flexible';
import type { MiddlewareHandler } from 'astro';
import { create_response_cookie, create_response_status, first_initialization, verify_recaptcha_token } from "./utils/api_helper";
import cookie from 'cookie';

const rateLimiterMemory = new RateLimiterMemory({
    points: 50, // Max 50 requests
    duration: 3600, // Per 1 hour
});

export const onRequest: MiddlewareHandler = async (context, next) => {
    await first_initialization();

    // Prevent DDOS attack
    // use recaptcha for API endpoint
    if(context.url.href.includes("api/") && !context.url.href.includes("/api/recaptcha")) {
        // Verify that the user is already verify captcha
        const recaptcha_token = context.cookies.get("recaptcha_token")?.value;
        if(!recaptcha_token) {
            return create_response_status(511);
        }
        
        // Verify the captcha token
        const result = await verify_recaptcha_token(recaptcha_token);
        if(!result) {
            const recaptcha_cookie = cookie.serialize("recaptcha_token", "", {
                expires: new Date(),
                path: '/',
                sameSite: 'strict',
                httpOnly: false,
            });
            return create_response_cookie({}, recaptcha_cookie, 511);
        }

        // Use ratelimiter to the captcha
        try {
            await rateLimiterMemory.consume(recaptcha_token);
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
