import { create_response_json, create_response_status } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";

export async function GET() {
  try {
    const pic_data = await prisma.report_PIC.findMany();
    const location_data = await prisma.report_Location.findMany();

    return create_response_json({
      pic_data: pic_data,
      location_data: location_data
    });
  }
  catch(err) {
    console.log(`There's an error when trying to get report configuration data. Error: ${err}`);
    return create_response_status(500);
  }
}