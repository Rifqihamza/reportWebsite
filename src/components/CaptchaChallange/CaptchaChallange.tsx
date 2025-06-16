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
      if (result == APIResultType.NeedCaptchaAuthentication) {
        setIsCaptchaNeeded(true);
      }
      else if (result == APIResultType.InternalServerError) {
        alert("Please try again later.");
      }
      else if (result == APIResultType.DatabaseError) {
        alert("There's an error in database. (Database problem)");
      }
      else {
        window.location.href = "/loginPage";
      }
    });
  }, []);

  function handleVerification(token: string, ekey: string) {
    if (token) {
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
                window.location.href = "/";
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
    {isCaptchaNeeded ?
      <div className="bg-black/60 backdrop-blur-md absolute inset-0 flex p-3">
        <div className="relative overflow-hidden flex flex-col m-auto bg-[#1f324d] [box-shadow:0_0_4px_1px_#fff] text-[#E2DAD6] rounded-xl w-full max-w-md h-fit px-6 py-3">
          <div className='bg-amber-400 [box-shadow:0_0_4px_1px_#fff] rounded-full w-60 h-60 absolute -top-1/2 -right-1/4'></div>
          <div className='bg-slate-800 [box-shadow:0_0_4px_1px_#fff] rounded-full w-60 h-60 absolute -bottom-1/2 -left-1/4'></div>
          <div className='text-center z-50'>
            <h1 className="text-xl font-semibold">Verify CAPTCHA First!</h1>
            <p className='text-lg'>Before Continue</p>
          </div>
          <div className='mx-auto mt-4 z-50'>
            <HCaptcha sitekey={PUBLIC_SITE_KEY} onVerify={handleVerification} onError={handleError} />
          </div>
          <PrimeReactProvider>
            <div className="w-full text-center py-4 z-50">
              <ProgressBar
                value={progress}
                displayValueTemplate={() => <></>}
                className={"max-h-[1rem]" + (progress == 0 ? " opacity-0" : "opacity-1 transform duration-300")} />
              <p className="text-center text-gray-100">{progress > 0 ? "Please wait.." : ""}</p>
            </div>
          </PrimeReactProvider>
        </div>
      </div>
      :
      ""
    }
  </>
}
