import React, { Suspense } from "react"
import LoadingAnimation from "../../../components/GlobalComponents/Loading/LoadingAnimation"

const ConfigurationComponent = React.lazy(() => import("../../../components/DashboardComponents/UsersDashboard/UsersTabComponent"))

export default function ConfigurationPage() {
    return (
        <>
            <Suspense fallback={<LoadingAnimation />}>
                <ConfigurationComponent />
            </Suspense>
        </>
    )
}