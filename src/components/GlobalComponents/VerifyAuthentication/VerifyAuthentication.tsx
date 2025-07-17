import { useEffect } from "react";
import Cookies from 'js-cookie';
import { APIResultType, checkAuthentication } from "../../../utils/api_interface";
import { useNetworkConnectivityHook } from "../../../hooks/shared/useNetworkConnectivity";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";


export default function VerifyAuthentication() {
  const { isConnected } = useNetworkConnectivityHook();
  const { showMessageByAPI } = useMessageToastHook();
  
  useEffect(() => {
    if(!isConnected) {
      return;
    }

    // if (!Cookies.get("captcha_token")) {
    //   window.location.href = "/captcha/";
    //   return;
    // }

    checkAuthentication().then((result) => {
      if (result == APIResultType.NeedCaptchaAuthentication && !window.location.href.includes("captcha")) {
        window.location.href = "/captcha/";
      }
      else if (result == APIResultType.Unauthorized && !window.location.href.includes("login")) {
        window.location.href = "/loginPage/";
      }
    })
  }, []);

  return <></>;
}