import React, { Suspense } from "react";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";


const ReportTableWrapper = React.lazy(() => import("../../components/TableReport/ReportTableWrapper"));

export default function TableReportPages() {
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
