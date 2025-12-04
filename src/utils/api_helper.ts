import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import cookie from 'cookie';
import { prisma } from "./db";
import { ActivityType, Prisma, type Users } from "@prisma/client";
import { APIResultType } from "./api_interface";
import { redisClient } from "./redis";
import { User_TypeGuard } from "../types/variables";

let done_initialization = false;
const alphabets: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const REDIS_TIMEOUT = 1000;

export function apiresult_to_status(api_result: any): Response {
    switch (api_result) {
        case APIResultType.DatabaseError:
            return create_response_status(503);
        case APIResultType.InternalServerError:
            return create_response_status(500);
        default:
            return create_response_status(401);
    }
}

// First Initialization
export async function first_initialization() {
    if (done_initialization) {
        return;
    }

    console.info("SERVER INITALIZATION IS DONE!");
    done_initialization = true;

    configDotenv();
}


// API Result
export function create_response_json(body: Object): Response {
    return new Response(JSON.stringify(body), {
        headers: {
            "Content-Type": "application/json"
        },
        status: 200
    });
}

export function create_response_status(status: number): Response {
    return new Response("", {
        status: status
    });
}

export function create_response_cookie(body: object, cookie: string, status?: number): Response {
    return new Response(JSON.stringify(body), {
        status: status || 200,
        headers: {
            "Set-Cookie": cookie,
            "Content-Type": JSON.stringify(body) != "{}" ? "application/json" : "text/plain"
        }
    });
}


// Get Cookie
export function get_cookies_from_request(request: Request): Record<string, string | undefined> | undefined {
    const request_cookie = request.headers.get('cookie');

    if (!request_cookie) {
        return undefined;
    }

    return cookie.parse(request_cookie);
}


// Security
export function generate_user_token(username: string): string {
    return jwt.sign({ username }, process.env.JWT_SECRET!);
}

export function verify_token_valid(token: string): string | undefined {
    try {
        const result = jwt.verify(token, process.env.JWT_SECRET!);
        if (typeof result == "string") {
            return undefined;
        }

        return result.username;
    }
    catch (err) {
        return undefined;
    }
}

/**
 * Return Information: [verified, error_state, user_data]
 */
export async function verify_user_data_token(token: string): Promise<[true, true, Users] | [false, undefined | APIResultType, undefined]> {
    const result = verify_token_valid(token);

    if (!result) {
        return [false, undefined, undefined];
    }

    let user_data;

    // Use cached data
    const cached_user_data = await get_cache(`cached-user-data-${result}`) ?? {};
    const parsed_cached_user_data = User_TypeGuard.safeParse(cached_user_data);
    if(parsed_cached_user_data.success) {
        user_data = parsed_cached_user_data.data;
    }
    else {
        try {
            user_data = await prisma.users.findUnique({
                where: {
                    lowercased_username: result.toLowerCase(),
                }
            });
            await set_cache(`cached-user-data-${result}`, user_data, 60*60*24*2);
        }
        catch (err) {user_data
            if (err instanceof Prisma.PrismaClientInitializationError) {
                return [false, APIResultType.DatabaseError, undefined];
            }
            console.error(`There's an error when trying to get user data : ${err}`);
            return [false, APIResultType.InternalServerError, undefined];
        }
    }
    

    return (user_data && !user_data.inactive) ? [true, true, user_data] : [false, undefined, undefined];
}

export function verify_admin_token(token?: string): boolean {
    return token === process.env.ADMIN_TOKEN;
}

export function process_server_token(): string {
    return jwt.sign({ key: process.env.PHP_SERVER_KEY! }, process.env.JWT_SECRET!);
}

export async function verify_captcha_token(token: string): Promise<boolean | APIResultType> {
    try {
        const result = await prisma.verifiedCaptcha.findUnique({
            where: {
                token: token
            }
        });

        if (!result) {
            return false;
        }

        if (result.expire_at <= new Date()) {
            try {
                await prisma.verifiedCaptcha.delete({
                    where: {
                        token: token
                    }
                });
            }
            catch (err) {
                console.error(`There's an error when trying to delete verified captcha of expire date. Error: ${err}`);
            }

            return false;
        }

        return true;
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientInitializationError) {
            return APIResultType.DatabaseError;
        }
        console.error(`There's an error when trying to get user data : ${err}`);
        return APIResultType.InternalServerError;
    }
}

export async function check_database_connection(): Promise<boolean> {
    try {
        await prisma.$connect(); // Connects to the database
        return true;
    } catch (error) {
        console.error(`There's an error when trying to connect to database. Error: ${error}`);
        return false;
    } finally {
        await prisma.$disconnect(); // Disconnects from the database
    }
}

export function generate_captcha_token(): string {
    let result = "";
    for (let i = 0; i < 100; i++) {
        result += alphabets[Math.floor(Math.random() * alphabets.length)];
    }

    return result;
}

export function record_activity({ ip_address, url, activity_type, user_id }: { ip_address: string, url: string, activity_type: ActivityType, user_id: string }) {
    return;
    prisma.recordedActivity.create({
        data: {
            ip_address: ip_address,
            url: url,
            activity_type: activity_type,
            account: {
                connect: {
                    id: user_id
                }
            }
        }
    });
}

export async function race_functions<T, U>(f: () => Promise<T>, g: () => Promise<U>): Promise<T | U> {
    return (await Promise.race([
        new Promise<T>((res, _) => {
            f().then((result) => res(result));
        }),
        new Promise<U>((res, _) => {
            g().then((result) => res(result));
        })
    ]));
}

export async function await_for<T>(f: () => Promise<T>, timeout: number): Promise<T|null> {
    return race_functions<T, null>(f, async () => {
        return await (new Promise((res, _) => { setTimeout(() => { res(null); }, timeout) }));
    })
}

export async function await_for_with_default<T, U>(f: () => Promise<T>, timeout: number, def: U): Promise<T|U> {
    return (await await_for(async () => {
        try {
            return await f();
        }
        catch(_) {
            return def;
        }
    }, timeout)) ?? def;
}

export async function get_cache(key: string): Promise<null | any> {
    // Get Redis for several seconds before using database
    const redis = await await_for_with_default(async () => (await redisClient), REDIS_TIMEOUT, null);
    if(!redis) return null;

    // Get the data
    let data_json = await await_for_with_default(async () => (await redis.get(key)), REDIS_TIMEOUT, null);

    // If the data is not found
    if(!data_json) {
        return null
    }

    // Return the object
    return JSON.parse(data_json);
}

export async function set_cache(key: string, value: any, expire: number): Promise<void> {
    // Get Redis
    const redis = await await_for_with_default(async () => (await redisClient), REDIS_TIMEOUT, null);
    if(!redis) return;

    // Set the cache
    await await_for(async () => (await redis.setEx(key, expire, JSON.stringify(value))), REDIS_TIMEOUT); // Expire after a day
}

export async function del_cache(key: string): Promise<void> {
    // Get Redis
    const redis = await await_for_with_default(async () => (await redisClient), REDIS_TIMEOUT, null);
    if(!redis) return;
    
    // Delete the cache data
    await await_for(async () => (await redis.del(key)), REDIS_TIMEOUT); // Expire after a day
}