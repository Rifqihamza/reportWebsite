import { useEffect } from "react";
import { APIResultType, checkAuthentication } from "../../../utils/api_interface";
import { useNetworkConnectivityHook } from "../../../hooks/shared/useNetworkConnectivity";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";


export default function VerifyAuthentication() {
  const { isConnected } = useNetworkConnectivityHook();
  const { showMessage } = useMessageToastHook();
  
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
      else if(result == APIResultType.RateLimited) {
        showMessage("Error", "error", "Anda sudah ter-limit, Coba lagi nanti!");
      }
      else if(result == APIResultType.DatabaseError) {
        showMessage("Error", "error", "Database sedang error, Coba lagi nanti!");
      }
    })
  }, []);

  return <></>;
}