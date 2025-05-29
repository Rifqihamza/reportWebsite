import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { PrimeReactProvider } from "primereact/api";

const PUBLIC_SITE_KEY = "9d404a42-7eee-446a-94ae-e5c8c8dc7050";

interface Props {
  onError?: () => void;
  onSuccess?: (token: string) => void;
  onIncorrect?: () => void;
}

export default function CaptchaChallange({ onSuccess, onError, onIncorrect }: Props) {
  const [progress, setProgress] = useState(0);
  function handleVerification(token: string, ekey: string) {
    if(token) {
      setProgress(50)
      fetch("/api/recaptcha", {
        method: "POST",
        body: JSON.stringify({ recaptcha_token: token })
      })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setTimeout(() => {
            setProgress(100);
            onSuccess ? onSuccess(token) : "";
            setTimeout(() => {
              history.back()
            }, 1000);
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

  function handleError(event: string) {
    console.log("ERROR : " + event);
    onError ? onError() : "";
  }


  return <>
    <div className="flex flex-col gap-6 justify-center items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className="text-gray-100 text-xl">Please, Verify CAPTCHA first before continue:</h1>
      <HCaptcha sitekey={PUBLIC_SITE_KEY} onVerify={handleVerification} onError={handleError} />
      <PrimeReactProvider>
        <div className="w-full h-1 text-center">
          <ProgressBar value={progress} displayValueTemplate={() => <></>} className={"max-h-[1rem]" + (progress == 0 ? " opacity-0" : "")}  />
          <p className="text-center text-gray-100">{progress > 0 ? "Please wait.." : ""}</p>
        </div>
      </PrimeReactProvider>
    </div>
  </>
}