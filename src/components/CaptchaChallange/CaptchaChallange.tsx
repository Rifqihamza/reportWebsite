import { useState } from "react";
import HCaptcha from '@hcaptcha/react-hcaptcha';

const PUBLIC_SITE_KEY = "9d404a42-7eee-446a-94ae-e5c8c8dc7050";

interface Props {
  onError?: () => void;
  onSuccess?: (token: string) => void;
  onIncorrect?: () => void;
}

declare global {
    interface Window {
      grecaptcha: any;
    }
}

export default function CaptchaChallange({ onSuccess, onError, onIncorrect }: Props) {
  const [readyCaptcha, setReadyCaptcha] = useState(false);

  function handleVerification(token: string, ekey: string) {
    if(token) {
      fetch("/api/recaptcha", {
        method: "POST",
        body: JSON.stringify({ recaptcha_token: token })
      })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setTimeout(() => {
            onSuccess ? onSuccess(token) : "";
          }, 1000);
        } else {
          onError ? onError() : "";
        }
      })
    }
    else {
      onIncorrect ? onIncorrect() : "";
      console.log(`INCORRECT`);
    }
  }

  function handleError() {
    console.log("ERROR");
    onError ? onError() : "";
  }

  function handle_recaptcha() {

  }
  

  return <>
    <div className="flex flex-col gap-6 justify-center items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className="text-gray-100 text-xl">Please, Verify CAPTCHA first before continue:</h1>
      <HCaptcha sitekey={PUBLIC_SITE_KEY} onVerify={handleVerification} />
    </div>
  </>
}