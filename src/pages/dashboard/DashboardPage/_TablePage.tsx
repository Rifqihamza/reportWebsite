import React, { Suspense } from "react";
import LoadingAnimation from "../../../components/GlobalComponents/Loading/LoadingAnimation";

const ReportTableWrapper = React.lazy(() => import("../../../components/DashboardComponents/TableDashboard/ReportTableWrapper"));

export default function TablePage() {
    return (
        <>
            <div className="space-y-4">
                <Suspense fallback={<LoadingAnimation />}>
                    <ReportTableWrapper />
                </Suspense>
            </div>
        </>
    );
}
