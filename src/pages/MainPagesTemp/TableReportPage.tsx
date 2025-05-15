import type { Dispatch, SetStateAction } from "react";
import type { ReportData, User } from "../../types/variables";
import React, { Suspense } from "react";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";


const ReportTableWrapper = React.lazy(() => import("../../components/TableReport/ReportTableWrapper"));

export default function TableReportPages({ userData, reportData, setReportData }: { userData: User | null, reportData: ReportData[], setReportData: Dispatch<SetStateAction<ReportData[]>> }) {
  return (
    <>
      <div className="px-4 space-y-3">
        <Suspense fallback={<LoadingAnimation />}>
            <ReportTableWrapper userData={userData} reportData={reportData} setReportData={setReportData} />
        </Suspense>
      </div>
    </>
  );
}
