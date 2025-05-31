import React, { Suspense } from "react";
import LoadingAnimation from "../../../components/Loading/LoadingAnimation";

export default function SettingPage() {
    const SettingComponent = React.lazy(() => import("../../../DashboardComponents/SettingDashboard/SettingComponent"))
    return (
        <Suspense fallback={<LoadingAnimation />}>
            <SettingComponent />
        </Suspense>
    );
}
