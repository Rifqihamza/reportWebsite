import { RateLimiterMemory } from 'rate-limiter-flexible';
import type { MiddlewareHandler } from 'astro';
import { create_response_status, first_initialization } from "./utils/api_helper";

const rateLimiterMemory = new RateLimiterMemory({
    points: 50, // Max 50 requests
    duration: 3600, // Per 1 hour
});

export const onRequest: MiddlewareHandler = async (context, next) => {
    await first_initialization();

    try {
        await rateLimiterMemory.consume(
            context.clientAddress ?? context.request.headers.get('x-forwarded-for') ?? 'unknown'
        );
    } catch {
        return create_response_status(429); // stop here
    }

    // Add security layer for response headers
    const response = await next();

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
};
