import React, { Suspense } from "react";
import ReportTableToolbar from "./Toolbar/ReportTableToolbar";
import LoadingAnimation from "../../GlobalComponents/Loading/LoadingAnimation";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";

const ReportTableComponent = React.lazy(() => import("./ReportTableComponent"));

export default function ReportTableWrapper() {
    const { activeTab } = useDashboardNavbarHook();
    if(activeTab !== 1) {
        return <></>;
    }

    return <>
        <div className="p-4 space-y-4 w-full">
            <ReportTableToolbar />
            <Suspense fallback={<LoadingAnimation />}>
                <ReportTableComponent />
            </Suspense>
        </div>
    </>
}