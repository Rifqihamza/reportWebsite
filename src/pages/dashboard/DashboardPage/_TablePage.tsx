import React, { Suspense } from "react";
import LoadingAnimation from "../../../components/Loading/LoadingAnimation";

const ReportTableWrapper = React.lazy(() => import("../../../DashboardComponents/TableDashboard/ReportTableWrapper"));

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
