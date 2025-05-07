import type { Dispatch, SetStateAction } from "react";
import ReportFormComponent from "../../components/ReportFormComponent";
import type { Report } from "@prisma/client";
import type { ReportData } from "../../types/variables";

export default function ReportForm({ setReportData, reportData }: { setReportData: Dispatch<SetStateAction<ReportData[]>>, reportData: ReportData[] }) {

  return (
    <>
      {/* Header Title */}
      <div className="flex flex-row gap-2 justify-center items-center mb-4 md:justify-normal">
        <img src="/reportIcon.svg" className="w-7 h-auto md:w-6 md:h-auto" alt="" />
        <h1 className="font-bold uppercase tracking-[2px] text-md md:text-lg text-black">Laporkan Temuanmu</h1>
      </div>
      <ReportFormComponent reportData={reportData} setReportData={setReportData} />
    </>
  );
}
