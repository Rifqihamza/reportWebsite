import type { Dispatch, SetStateAction } from "react";
import ReportFormComponent from "../../components/FormReport/ReportFormComponent";
import type { ReportData } from "../../types/variables";

export default function ReportForm({ reportData, setReportData }: { reportData: ReportData[], setReportData: Dispatch<SetStateAction<ReportData[]>> }) {

  return (
    <>
      <div className="flex flex-row gap-2 justify-center items-center mb-4 md:justify-normal">
        <i className="pi pi-exclamation-circle" />
        <h1 className="titlePage">Laporkan Temuanmu</h1>
      </div>
      {/* End Header Title */}
      <ReportFormComponent reportData={reportData} setReportData={setReportData} />
    </>
  )
}
