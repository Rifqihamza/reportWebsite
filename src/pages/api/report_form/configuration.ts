import type { APIContext } from "astro";
import { create_response_json, create_response_status } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";
import { Campus, string_to_campus } from "../../../types/variables";

export async function GET({ request }: APIContext) {
  const url = new URL(request.url);

  const selected_campus_name: Campus | undefined = string_to_campus(url.searchParams.get("campus") ?? undefined);

  if (!selected_campus_name) {
    console.log(`url.searchParams.get("campus"): ${url.searchParams.get("campus")}`);
    return create_response_status(400);
  }

  try {
    const parameter = {
      where: {
        campus_name: selected_campus_name 
      }
    };

    const pic_data = await prisma.report_PIC.findMany(parameter);
    const location_data = await prisma.report_Location.findMany(parameter);

    return create_response_json({
      pic_data: pic_data,
      location_data: location_data
    });
  }
  catch (err) {
    console.log(`There's an error when trying to get report configuration data. Error: ${err}`);
    return create_response_status(500);
  }
}