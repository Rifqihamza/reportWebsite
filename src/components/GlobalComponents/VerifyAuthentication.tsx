import { useEffect } from "react";
import Cookies from 'js-cookie';
import { APIResultType, checkAuthentication } from "../../utils/api_interface";


export default function VerifyAuthentication() {
  useEffect(() => {
    if(window.location.href.includes("captcha")) {
      return;
    }
    
    if (!Cookies.get("captcha_token")) {
      window.location.href = "/captcha/";
      return;
    }

    checkAuthentication().then((result) => {
      console.log(result);
      if (result == APIResultType.NeedCaptchaAuthentication) {
        window.location.href = "/captcha/";
      }
      else if (result == APIResultType.Unauthorized && !window.location.href.includes("loginPage")) {
        window.location.href = "/loginPage/";
      }
    })
  }, []);

  return <></>;
}