import type { Dispatch, SetStateAction } from "react";
import type { ReportData, User } from "../../../types/variables";
import React, { Suspense } from "react";
import LoadingAnimation from "../../../components/Loading/LoadingAnimation";

export default function TablePage({ userData, reportData, setReportData }: { userData: User | null, reportData: ReportData[], setReportData: Dispatch<SetStateAction<ReportData[]>> }) {
    const ReportTableWrapper = React.lazy(() => import("../../../components/DashboardComponents/TableReport/ReportTableWrapper"));
    return (
        <>
            <div className="space-y-4">
                <Suspense fallback={<LoadingAnimation />}>
                    <ReportTableWrapper userData={userData} reportData={reportData} setReportData={setReportData} />
                </Suspense>
            </div>
        </>
    );
}
