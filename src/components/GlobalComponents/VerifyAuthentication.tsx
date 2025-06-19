import { useEffect } from "react";
import Cookies from 'js-cookie';
import { APIResultType, checkAuthentication } from "../../utils/api_interface";


export default function VerifyAuthentication() {
  useEffect(() => {
    if (!Cookies.get("captcha_token")) {
      // window.location.href = "/captcha/";
      return;
    }

    checkAuthentication().then((result) => {
      if (result == APIResultType.NeedCaptchaAuthentication && !window.location.href.includes("captcha")) {
        window.location.href = "/captcha/";
      }
      else if (result == APIResultType.Unauthorized && !window.location.href.includes("login")) {
        window.location.href = "/loginPage/";
      }
      else if(result == APIResultType.DatabaseError) {
        alert("Database sedang error. Mohon coba lagi.");
      }
    })
  }, []);

  return <></>;
}