import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
    if (context.url.pathname !== "/") {
        return context.redirect('/', 307); // temporary
    }

    return next();
};
