import { Prisma } from "@prisma/client";
import { create_response_json, create_response_status } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";
import { Report_Location_TypeGuard, Report_PIC_TypeGuard } from "../../../types/variables";

export async function GET() {
  try {
    const pic_data = await prisma.report_PIC.findMany();
    const location_data = await prisma.report_Location.findMany();


    // Parse safely data in order to make sure its data structure
    {
      const safe_parse_result = Report_Location_TypeGuard.safeParse(location_data[0]);
      if (!safe_parse_result.success) {
        console.log(`Did you forgot to change the report location type guard? error: ${safe_parse_result.error}`);
        return create_response_status(500);
      }
    }
    {
      const safe_parse_result = Report_PIC_TypeGuard.safeParse(pic_data[0]);
      if (!safe_parse_result.success) {
        console.log(`Did you forgot to change the report PIC type guard? error: ${safe_parse_result.error}`);
        return create_response_status(500);
      }
    }


    return create_response_json({
      pic_data: pic_data,
      location_data: location_data
    });
  }
  catch (err) {
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return create_response_status(503);
    }
    console.log(`There's an error when trying to get report configuration data. Error: ${err}`);
    return create_response_status(500);
  }
}
