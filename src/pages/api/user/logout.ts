import type { APIContext } from "astro";
import { create_response_cookie } from "../../../utils/api_helper";
import cookie from 'cookie';

export async function POST({}: APIContext) {
    const clear_user_token_cookie = cookie.serialize("user_token", "", {
        expires: new Date(),
        path: '/',
        sameSite: 'strict',
        httpOnly: false,
    });
    
    return create_response_cookie({}, clear_user_token_cookie);
}