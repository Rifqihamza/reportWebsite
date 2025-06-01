import { useReportFilterHook, useReportPaginationHook } from "../../hooks/useReportHook";
import ReportMobileCard from "./ReportMobileCard";

export default function ReportMobileTable() {
  const { filteredReports } = useReportFilterHook();
  const { showedReportData } = useReportPaginationHook();
  
  return <div className="md:hidden space-y-4">
    {filteredReports.length === 0 ? (
      <h1 className="opacity-75">Tidak ada laporan..</h1>
    ) : (
      showedReportData.map((report) => (
        <ReportMobileCard key={report.id} report={report} />
      ))
    )}
  </div>;
  
}