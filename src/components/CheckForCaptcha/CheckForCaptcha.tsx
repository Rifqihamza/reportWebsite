import { useEffect } from "react";
import Cookies from 'js-cookie';
import { checkCaptcha } from "../../utils/api_interface";


export default function CheckForCaptcha() {
  useEffect(() => {
    if(window.location.href.includes("captcha")) {
      return;
    }
    
    if (!Cookies.get("recaptcha_token")) {
      window.location.href = "/captcha/";
    }

    checkCaptcha().then((result) => {
      if(!result) {
        window.location.href = "/captcha/";
      }
    })
  }, []);

  return <></>;
}