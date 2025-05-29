import { useEffect, useState } from 'react';
import MainPage from './_index';
import WelcomeComponent from '../../components/WelcomeOverlay/WelcomeComponent';
import CaptchaChallange from "../../components/CaptchaChallange/CaptchaChallange";
import Cookies from 'js-cookie';

export default function WrapperPage() {
    const [showMain, setShowMain] = useState(true);
    const [verifiedRecaptchaToken, setVerifiedRecaptchaToken] = useState(false);

    useEffect(() => {
        if (!sessionStorage.getItem("no-welcome-page")) {
            sessionStorage.setItem("no-welcome-page", "true");
            setShowMain(false);
        }

        if (Cookies.get("recaptcha_token")) {
            setVerifiedRecaptchaToken(true);
        }
    }, []);

    return (
        <>
            {verifiedRecaptchaToken ? (showMain ? <MainPage /> : <WelcomeComponent onFinish={() => setShowMain(true)} />) : <CaptchaChallange onSuccess={() => setVerifiedRecaptchaToken(true)} />}
        </>
    );
}
