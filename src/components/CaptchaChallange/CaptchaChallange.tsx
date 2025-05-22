
import ReCAPTCHA from "react-google-recaptcha";

const PUBLIC_SITE_KEY = "6Ld57UMrAAAAAFrbW2npN0AnUDxbnc_DUDEB9Dgu";

interface Props {
  onError?: () => void;
  onSuccess?: (token: string) => void;
  onIncorrect?: () => void;
}

export default function CaptchaChallange({ onSuccess, onError, onIncorrect }: Props) {

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
  

  return <>
    <div className="flex justify-center items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <ReCAPTCHA 
        sitekey={PUBLIC_SITE_KEY}
        onChange={handleChange}
        onError={handleError}
      />
    </div>
  </>
}