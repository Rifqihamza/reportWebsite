import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const PUBLIC_SITE_KEY = "6Lc3XUQrAAAAAG2cp9bh0kJs2clqS1wvmeGrBeus";

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
  const [disableVerify, setDisableVerify] = useState(false);

  function handleChange(token: string | null) {
    if(token) {
      fetch("/api/recaptcha", {
        method: "POST",
        body: JSON.stringify({ recaptcha_token: token })
      })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          onSuccess ? onSuccess(token) : "";
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
    if(!readyCaptcha) {
      return;
    }
    setDisableVerify(true);

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(PUBLIC_SITE_KEY, { action: "homepage" })
        .then((token: string) => {
          handleChange(token);
        })
        .catch(() => {
          handleError();
        })
    });

    setDisableVerify(false);
  }
  
  function handleLoaded() {
    setReadyCaptcha(true);
  }

  useEffect(() => {
    // Add reCaptcha
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${PUBLIC_SITE_KEY}`
    script.addEventListener("load", handleLoaded)
    document.body.appendChild(script)
  }, []);


  return <>
    <div className="flex flex-col gap-6 justify-center items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        className="g-recaptcha"
        data-sitekey={PUBLIC_SITE_KEY}
        data-size="invisible"
      ></div>
      <h1 className="text-gray-100 text-xl">Please, Verify CAPTCHA first before continue:</h1>
      <button className="disabled:opacity-50 disabled:pointer-events-none w-full tracking-[1px] font-bold px-6 py-4 bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_10px_0_#E2DAD6] active:[box-shadow:0_5px_0_#E2DAD6] active:-translate-y-[5px] text-white rounded-full" disabled={disableVerify} onClick={handle_recaptcha}>Verify</button>
    </div>
  </>
}