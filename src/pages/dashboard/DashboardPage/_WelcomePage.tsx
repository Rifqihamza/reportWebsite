import React, { Suspense } from "react";
import LoadingAnimation from "../../../components/Loading/LoadingAnimation";

export default function WelcomePage() {
    const WelcomePage = React.lazy(() => import("../../../DashboardComponents/WelcomeDashboard/WelcomeComponent"))
    return (
        <Suspense fallback={<LoadingAnimation />}>
            <WelcomePage />
        </Suspense>
    )
}