import { RateLimiterMemory } from 'rate-limiter-flexible';
import type { MiddlewareHandler } from 'astro';
import { create_response_status } from "./utils/api_helper";

const rateLimiterMemory = new RateLimiterMemory({
    points: 50, // Max 10 requests
    duration: 60, // Per 60 seconds per IP
});

export const onRequest: MiddlewareHandler = async (context, next) => {    
    // Check the rate-limiter
    rateLimiterMemory.consume(context.clientAddress ?? context.request.headers.get('x-forwarded-for') ?? 'unknown').catch(() => {
        return create_response_status(429);
    })

    
    // Add security layer for response headers
    const response = await next();

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
};
