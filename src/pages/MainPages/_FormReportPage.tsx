import type { Dispatch, SetStateAction } from "react";
import ReportFormComponent from "../../components/FormReport/ReportFormComponent";
import type { ReportData } from "../../types/variables";

export default function ReportForm({ reportData, setReportData }: { reportData: ReportData[], setReportData: Dispatch<SetStateAction<ReportData[]>> }) {

  return (
    <>
      {/* End Header Title */}
      <ReportFormComponent reportData={reportData} setReportData={setReportData} />
    </>
  )
}
