import React, { Suspense } from "react";
import { ReportHookEffect } from "../../../hooks/useReportHook";
import ReportTableToolbar from "./ReportTableToolbar";
import LoadingAnimation from "../../GlobalComponents/Loading/LoadingAnimation";

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