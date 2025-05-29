import { create_response_status } from "../../utils/api_helper";

export async function GET() {
  return create_response_status(200);
}