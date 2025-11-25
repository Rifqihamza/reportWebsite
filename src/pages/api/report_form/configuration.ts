import { Prisma, type Report_Location } from "@prisma/client";
import { create_response_json, create_response_status } from "../../../utils/api_helper";
import { prisma } from "../../../utils/db";
import { redisClient } from "../../../utils/redis";
import z from "zod";
import { Report_Location_TypeGuard } from "../../../types/variables";

export async function GET() {
  const redis = await redisClient;
  let location_data: Report_Location[];
  const cached_location_data: any = JSON.parse(await redis.get("cached-location-data") || "[0]");
  const parsed_cached_location_data = z.array(Report_Location_TypeGuard).safeParse(cached_location_data);
  if(parsed_cached_location_data.success) {
    location_data = parsed_cached_location_data.data;
  }
  else {
    try {
      console.log(parsed_cached_location_data.error);
      location_data = await prisma.report_Location.findMany();
      await redis.setEx("cached-location-data", 60*60*24, JSON.stringify(location_data)); // Cache Expires in a day
    }
    catch(err) {
      if(err instanceof Prisma.PrismaClientInitializationError) {
        return create_response_status(503);
      }
      console.log(`There's an error when trying to get report configuration data. Error: ${err}`);
      return create_response_status(500);
    }
  }
  

  return create_response_json({
    location_data: location_data
  });
}
