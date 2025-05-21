import { useState } from 'react';
import MainPage from './_index';
import WelcomeComponent from '../../components/WelcomeOverlay/WelcomeComponent';

export default function WrapperPage() {
    const [showMain, setShowMain] = useState(false);

    return (
        <>
            {/* {!showMain && <WelcomeComponent onFinish={() => setShowMain(true)} />}
            {showMain && <MainPage />} */}
            <MainPage />
        </>
    );
}
