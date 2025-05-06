import type { APIContext } from "astro";
import { create_response_json } from "../../utils/api_helper";

export async function POST({ request }: APIContext) {
    const body = await request.json();
    return create_response_json({ request_body: body });
}
