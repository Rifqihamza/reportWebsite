import type { APIContext } from "astro";
import { create_response_cookie, create_response_status, generate_captcha_token } from "../../utils/api_helper";
import { prisma } from "../../utils/db";
import cookie from 'cookie';

export async function POST({ request }: APIContext) {
  const data = await request.json();

  // Verify required data is exists
  if (!data.recaptcha_token) {
    return create_response_status(400);
  }

  // Setting up recaptcha verification body data
  const requestBody = new URLSearchParams({
    secret: process.env.CAPTCHA_SECRET_KEY!,  // This can be an environment variable
    response: data.recaptcha_token            // The token passed in from the client
  });

  // Verify recaptcha token by asking it to google
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: requestBody.toString()
  });

  if (response.status != 200) {
    console.error(`There's an error when trying to verify recaptcha token from Google. Error: ${await response.text()}`);
  }

  const responseData = await response.json();

  if (responseData.score < 0.3) {
    console.log(responseData);
    return create_response_status(401);
  }

  // Generate and store the generated captcha token to database
  const captcha_expire_date = new Date();
  captcha_expire_date.setHours(captcha_expire_date.getHours() + 1);

  const generated_captcha_token = generate_captcha_token();
  try {
    await prisma.verifiedCaptcha.create({
      data: {
        token: generated_captcha_token,
        expire_at: captcha_expire_date
      }
    });
  }
  catch(error) {
    console.error(`There's an error when trying to insert captcha token! Error: ${error}`);
    return create_response_status(500);
  }

  // Creating cookie for the user
  const recaptcha_cookie = cookie.serialize("recaptcha_token", generated_captcha_token, {
    expires: captcha_expire_date,
    path: '/',
    sameSite: 'strict',
    httpOnly: false,
  });

  return create_response_cookie({success: true}, recaptcha_cookie);
}
