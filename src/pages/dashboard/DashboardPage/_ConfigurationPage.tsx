import React, { Suspense } from "react"
import LoadingAnimation from "../../../components/Loading/LoadingAnimation"
export default function ConfigurationPage() {
    const ConfigurationComponent = React.lazy(() => import("../../../components/DashboardComponents/ConfigurationDashboard/ConfigurationComponent"))
    return (
        <>
            <Suspense fallback={<LoadingAnimation />}>
                <ConfigurationComponent />
            </Suspense>
        </>
    )
}