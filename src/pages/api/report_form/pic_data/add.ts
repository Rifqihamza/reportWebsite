import type { APIContext } from "astro";
import { create_response_status } from "../../../../utils/api_helper";
import { prisma } from "../../../../utils/db";

type AddPICRequestBodyType = {
  name?: string
}

export async function POST({ request }: APIContext) {
  // Get the request body
  const body: AddPICRequestBodyType = await request.json();


  // Verify request body
  if(!body.name) {
    console.log("Body is not valid!");
    return create_response_status(400);
  }


  // Add data to Report_PIC table
  try {
    await prisma.report_PIC.create({
      data: {
        name: body.name
      }
    });
  }
  catch(err) {
    console.error(`There's an error when trying to create report_PIC data : ${err}`);
    return create_response_status(500);
  }

  return create_response_status(200);
}