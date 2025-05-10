import type { Dispatch, SetStateAction } from "react";
import ReportFormComponent from "../../components/ReportFormComponent";
import type { ReportData } from "../../types/variables";
import ReportIcon from '@mui/icons-material/Report';

export default function ReportForm({ reportData, setReportData }: { reportData: ReportData[], setReportData: Dispatch<SetStateAction<ReportData[]>> }) {

  return (
    <>
      {/* Header Title */}
      <div className="flex flex-row gap-2 justify-center items-center mb-4 md:justify-normal">
        <ReportIcon />
        <h1 className="font-bold uppercase tracking-[2px] text-md md:text-lg text-black">Laporkan Temuanmu</h1>
      </div>
      {/* End Header Title */}
      <ReportFormComponent reportData={reportData} setReportData={setReportData} />
    </>
  )
}
