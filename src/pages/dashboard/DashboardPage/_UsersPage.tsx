import React, { Suspense } from "react"
import LoadingAnimation from "../../../components/GlobalComponents/Loading/LoadingAnimation"

const UsersComponent = React.lazy(() => import("../../../components/DashboardComponents/UsersDashboard/UsersTabComponent"))

export default function UsersPage() {
    return (
        <>
            <Suspense fallback={<LoadingAnimation />}>
                <UsersComponent />
            </Suspense>
        </>
    )
}