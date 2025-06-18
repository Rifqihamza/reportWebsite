import LoadingAnimation from "../../../components/GlobalComponents/Loading/LoadingAnimation";
import React, { Suspense } from "react";
import UseExportHookEffect from "../../../hooks/useExportHook";

const ExportComponent = React.lazy(() => import("../../../components/DashboardComponents/ExportDashboard/ExportComponent"))

export default function ExportPage() {
    return (
        <>
            <UseExportHookEffect />
            <Suspense fallback={<LoadingAnimation />}>
                <ExportComponent />
            </Suspense>
        </>
    )
}