import LoadingAnimation from "../../../components/Loading/LoadingAnimation";
import React, { Suspense } from "react";
export default function ExportPage() {
    const ExportComponent = React.lazy(() => import("../../../DashboardComponents/ExportDashboard/ExportComponent"))
    return (
        <>
            <Suspense fallback={<LoadingAnimation />}>
                <ExportComponent />
            </Suspense>
        </>
    )
}