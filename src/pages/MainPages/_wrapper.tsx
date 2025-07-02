import { useEffect, useState } from 'react';
import MainPage from './_index';
import WelcomeComponent from '../../components/ReportFormComponents/WelcomeOverlay/WelcomeComponent';
import SelectCampusOverlay from "../../components/ReportFormComponents/SelectCampus/SelectCampusOverlay";
import { useCampusDataHook } from "../../hooks/shared/useCampusData";

export default function WrapperPage() {
    const [showWelcome, setShowWelcome] = useState(false);
    const { selectedCampus } = useCampusDataHook();

    useEffect(() => {
        if (!sessionStorage.getItem("no-welcome-page")) {
            sessionStorage.setItem("no-welcome-page", "true");
            setShowWelcome(true);
        }
    }, []);

    return (
        <>
            {(() => {
                // If the user should see the welcome animation
                if(showWelcome) {
                    return <WelcomeComponent onFinish={() => setShowWelcome(true)} />;
                }
                
                // If user hasn't select any campus
                if(!selectedCampus) {
                    return <SelectCampusOverlay />;
                }

                // If there's no welcome page, and the user has select a campus
                return <MainPage />;
            })()}
        </>
    );
}
