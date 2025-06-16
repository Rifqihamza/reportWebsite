import React, { Suspense } from "react";
import LoadingAnimation from "../../../components/GlobalComponents/Loading/LoadingAnimation";

export default function SettingPage() {
    const SettingComponent = React.lazy(() => import("../../../components/DashboardComponents/SettingDashboard/SettingComponent"))
    return (
        <Suspense fallback={<LoadingAnimation />}>
            <SettingComponent />
        </Suspense>
    );
}
