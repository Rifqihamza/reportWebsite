import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import cookie from 'cookie';
import { prisma } from "./db";
import { AccountType } from "@prisma/client";
import type { Campus } from "../types/variables";

let done_initialization = false;
const alphabets: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";


// First Initialization
export async function first_initialization() {
    if (done_initialization) {
        return;
    }
    
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

export function verify_user_token(token: string): string | undefined {
    try {
        const result = jwt.verify(token, process.env.JWT_SECRET!);
        if (typeof result == "string") {
            return undefined;
        }

        return result.username;
    }
    catch {
        return undefined;
    }
}

export async function verify_teacher_token(token: string): Promise<boolean | undefined> {
    const result = verify_user_token(token);

    if (!result) {
        return;
    }

    const user_data = await prisma.users.findUnique({
        where: {
            username: result
        }
    });

    return user_data?.role === AccountType.Admin;
}

export function verify_admin_token(token?: string): boolean {
    return token === process.env.ADMIN_TOKEN;
}

export function process_server_token(report_num: number): string {
    return jwt.sign({ report_num: report_num }, process.env.JWT_SECRET!);
}

export async function verify_captcha_token(token: string): Promise<boolean> {
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
    catch {
        return false;
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