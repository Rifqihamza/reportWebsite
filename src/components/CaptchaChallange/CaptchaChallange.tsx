import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useEffect, useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { PrimeReactProvider } from "primereact/api";
import { APIResultType, checkAuthentication } from "../../utils/api_interface";

const PUBLIC_SITE_KEY = "9d404a42-7eee-446a-94ae-e5c8c8dc7050";

interface Props {
  onError?: () => void;
  onSuccess?: (token: string) => void;
  onIncorrect?: () => void;
}

export default function CaptchaChallange({ onSuccess, onError, onIncorrect }: Props) {
  const [progress, setProgress] = useState(0);
  const [isCaptchaNeeded, setIsCaptchaNeeded] = useState(false);

  useEffect(() => {
    checkAuthentication().then((result) => {
      if(result == APIResultType.NeedCaptchaAuthentication) {
        setIsCaptchaNeeded(true);
      }
      else if(result == APIResultType.InternalServerError) {
        alert("Please try again later.");
      }
      else if(result == APIResultType.DatabaseError) {
        alert("There's an error in database. (Database problem)");
      }
      else {
        window.location.href = "/loginPage";
      }
    });
  }, []);
  
  function handleVerification(token: string, ekey: string) {
    if(token) {
      setProgress(50)
      fetch("/api/captcha", {
        method: "POST",
        body: JSON.stringify({ captcha_token: token })
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
      .catch(err => {
        setProgress(0);
        alert("There's an error when trying to verify captcha..");
        onError ? onError() : "";
      });
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
    {isCaptchaNeeded ? <div className="flex flex-col gap-6 justify-center items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className="text-gray-100 text-xl">Please, Verify CAPTCHA first before continue:</h1>
      <HCaptcha sitekey={PUBLIC_SITE_KEY} onVerify={handleVerification} onError={handleError} />
      <PrimeReactProvider>
        <div className="w-full h-1 text-center">
          <ProgressBar value={progress} displayValueTemplate={() => <></>} className={"max-h-[1rem]" + (progress == 0 ? " opacity-0" : "")}  />
          <p className="text-center text-gray-100">{progress > 0 ? "Please wait.." : ""}</p>
        </div>
      </PrimeReactProvider>
    </div> : ""}
  </>
}