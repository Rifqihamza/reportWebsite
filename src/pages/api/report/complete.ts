import type { APIContext } from "astro";
import { create_response_status, verify_user_data_token, record_activity, process_server_token, create_response_json } from '../../../utils/api_helper';
import { APIResultType } from "../../../utils/api_interface";
import { account_to_api_privillage, AccountAPIPrivillage, ReportData_TypeGuard } from "../../../types/variables";
import { prisma } from "../../../utils/db";
import { ActivityType, Prisma, ReportStatus, type Report } from "@prisma/client";
import { z } from "zod";

const ConfirmBodyType = z.object({
  report_id: z.string(),
  confirmation_photo: z.instanceof(File)
});

export async function POST({ request, cookies }: APIContext) {
  //? Verify user_token
  const user_token = cookies.get("user_token")?.value;

  const [verification_result, verification_output, user_data] = await verify_user_data_token(user_token || "");
  if (verification_result !== true) {
    if (verification_output === APIResultType.DatabaseError) {
      return create_response_status(503);
    }
    else if (verification_output === APIResultType.InternalServerError) {
      return create_response_status(500);
    }

    return create_response_status(401);
  }

  //? Verify user role
  if (!account_to_api_privillage[user_data.role].includes(AccountAPIPrivillage.MarkCompeleteReport)) {
    return create_response_status(401);
  }

  //? Get the required data

  let result: {
    [key: string]: string | object | File;
  } = {};
  for (const [key, value] of (await request.formData()).entries()) {
    if (key == "confirmation_photo" && value instanceof File) {
      result[key] = value;
      continue;
    }

    result[key] = value.valueOf();
  }
  const parsed_result = ConfirmBodyType.safeParse(result);
  if(!parsed_result.success) {
    return create_response_status(400);
  }

  const { report_id, confirmation_photo }: { report_id: string, confirmation_photo: File; } = parsed_result.data;

  //? Verify the report data exists
  let prev_report_data: Report | null;
  try {
    prev_report_data = await prisma.report.findUnique({
      where: {
        id: report_id
      }
    });

    if (!prev_report_data) {
      return create_response_status(400);
    }
  }
  catch (err) {
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return create_response_status(503);
    }
    console.error(`There's an error when trying to get report data for verification: ${err}`);
    return create_response_status(500);
  }


  //? Upload the image
  if (confirmation_photo.size > 8 * 1024 * 1024) {
    console.log("Image size is too large!");
    return create_response_status(413);
  }

  if (!confirmation_photo.type.startsWith('image/')) {
    console.log("Image file type is not recognized as an image!");
    return create_response_status(415);
  }

  const form_data = new FormData();
  form_data.append("image", confirmation_photo);

  const server_token = process_server_token();


  let response;
  try {
    response = await fetch(`${process.env.PHP_SERVER_URL!}/upload_image.php`, {
      method: "POST",
      headers: {
        "Api-Authorization": process.env.PHP_SERVER_AUTHORIZATION!,
        "Cookie": `server_token=${server_token}`
      },
      body: form_data
    });
  }
  catch (err) {
    console.error(`There's an error when trying to get report data. Error: ${err}`);
    return create_response_status(500);
  }

  const image_file_path = await response.text();

  if (!response.ok) {
    console.error(`Error from PHP Server : ${image_file_path}`);
    return create_response_status(response.status);
  }

  if (typeof image_file_path != "string") {
    console.error(`The file path that php server gave is not a string!`);
    return create_response_status(500);
  }


  //? Update the data
  let update_result: null | Report = null;
  try {
    update_result = await prisma.report.update({
      where: {
        id: report_id
      },
      data: {
        status: ReportStatus.Complete,
        image_after_finish: image_file_path
      }
    });

    // Parse safely data in order to make sure its data structure
    const safe_parse_result = ReportData_TypeGuard.safeParse(update_result);
    if(!safe_parse_result.success) {
        console.log(`Did you forgot to change the report data type guard? error: ${safe_parse_result.error}`);
        return create_response_status(500);
    }
  }
  catch (err) {
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return create_response_status(503);
    }
    console.error(`There's an error when trying to update report data: ${err}`);
    return create_response_status(500);
  }


  //? Record Activity
  try {
    await record_activity({
      message: "Confirm a report data",
      url: request.url,
      activity_type: ActivityType.UpdateReport,
      user_id: user_data.id
    });
  }
  catch (err) {
    if (err instanceof Prisma.PrismaClientValidationError) {
      return create_response_status(400);
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
      return create_response_status(503);
    }

    console.error(`There's an error when trying to add activity record data. Error: ${err}`);
    return create_response_status(500);
  }


  return create_response_json(update_result);
}