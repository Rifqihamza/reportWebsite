import React, { Suspense } from "react";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import { ReportHookEffect } from "../../hooks/useReportHook";
import ReportTableToolbar from "./ReportTableToolbar";

const ReportListComponent = React.lazy(() => import("./ReportTableComponent"));

export default function ReportTableWrapper() {    

    return <>
        <ReportHookEffect />

        {/* Table Component */}
        <ReportTableToolbar />
        <Suspense fallback={<LoadingAnimation />}>
            <ReportListComponent />
        </Suspense>
    </>
}