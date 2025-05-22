import type { Dispatch, SetStateAction } from "react";
import ReportFormComponent from "../../components/FormReport/ReportFormComponent";
import type { ReportData } from "../../types/variables";

export default function ReportForm({ reportData, setReportData, isAuthorized }: { reportData: ReportData[], setReportData: Dispatch<SetStateAction<ReportData[]>>, isAuthorized: boolean }) {

  return (
    <>
      {/* End Header Title */}
      <ReportFormComponent reportData={reportData} setReportData={setReportData} isAuthorized={isAuthorized} />
    </>
  )
}
