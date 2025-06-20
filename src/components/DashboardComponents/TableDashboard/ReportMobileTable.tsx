import { useReportDataHook } from "../../../hooks/shared/useReportData";
import { useReportFilterHook, useReportPaginationHook } from "../../../hooks/useReportHook";
import LoadingAnimation from "../../GlobalComponents/Loading/LoadingAnimation";
import ReportMobileCard from "./ReportMobileCard";

export default function ReportMobileTable() {
  const { filteredReports } = useReportFilterHook();
  const { showedReportData } = useReportPaginationHook();
  const { reportData } = useReportDataHook();
  
  return <div className="md:hidden space-y-4">
    {(() => {
      // If the data is not loaded returns loading animation
      if (reportData === null) {
          return <div className="w-full h-full bg-white">
            <LoadingAnimation dark_bg />
          </div>
      }
      
      // If the data is empty shows message
      if(filteredReports.length === 0) {
        return <h1 className="opacity-75 text-white">Tidak ada laporan..</h1>;
      }
      
      return showedReportData.map((report) => (
          <ReportMobileCard key={report.id} report={report} />
        ));
    })()}
  </div>;
  
}