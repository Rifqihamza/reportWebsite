import { useEffect, useState } from 'react';
import MainPage from './_index';
import WelcomeComponent from '../../components/WelcomeOverlay/WelcomeComponent';

export default function WrapperPage() {
    const [showMain, setShowMain] = useState(true);

    useEffect(() => {
        console.log(sessionStorage.getItem("no-welcome-page"));
        if(!sessionStorage.getItem("no-welcome-page")) {
            sessionStorage.setItem("no-welcome-page", "true");
            setShowMain(false);
        }
    }, []);
    
    return (
        <>
            {!showMain && <WelcomeComponent onFinish={() => setShowMain(true)} />}
            {showMain && <MainPage />}
        </>
    );
}
