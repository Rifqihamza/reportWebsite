import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

let done_initialization = false;

// First Initialization
export async function first_initialization() {
    if(done_initialization) {
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
    })
}

export function create_response_status(status: number): Response {
    return new Response("", {
        status: status
    });
}

export function create_response_cookie(body: object, cookie: string): Response {
    return new Response(JSON.stringify(body), {
        status: 200,
        headers: {
            "Set-Cookie": cookie,
            "Content-Type": JSON.stringify(body) != "{}" ? "application/json" : "text/plain"
        }
    });
}


// Get Cookie
export function get_cookie_from_request(request: Request): {
    [k: string]: string;
} {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split('; ').map(c => {
        const [key, ...v] = c.split('=');
        return [key, v.join('=')];
        })
    );

    return cookies;
}


// Security
export function generate_user_token(username: string): string {
    return jwt.sign({ username }, process.env.JWT_SECRET!);
}

export function verify_user_token(token: string): string | undefined {
    try {
        const result = jwt.verify(token, process.env.JWT_SECRET!);
        if(typeof result == "string") {
            return undefined
        }
    
        return result.username;
    }
    catch {
        return undefined;
    }
}

export function verify_admin_token(token: string): boolean {
    return token === process.env.ADMIN_TOKEN;
}