import UseReportDataHookEffect, { useReportDataHook } from "../../../hooks/shared/useReportData";
import UseExportHookEffect, { handleExport, useExportHook } from "../../../hooks/pages/Export/useExportHook";
import DateRangeOptions from "./options/DateRangeOptions";
import OutputOptions from "./options/OutputOptions";
import RowOptions from "./options/RowOptions";
import FilterOptions from "./options/FilterOptions";
import { useEffect, useState } from "react";
import { useDashboardSidebarHook } from "../../../hooks/shared/useDashboardSidebar";
import OtherOptions from "./options/OtherOptions";
import { ProgressBar } from "primereact/progressbar";
import { seconds_to_general_time } from "../../../utils/other";
import { useInsightHook, UseReportStatisticsEffect } from "../../../hooks/pages/Statistics/useReportStatisticsHook";

export default function ExportPage() {
  const { activeTab } = useDashboardSidebarHook();
  const { selectedOutputType, otherOption, selectedRows } = useExportHook();
  const { reportData } = useReportDataHook();
  const { insight } = useInsightHook();

  const [processingState, setProcessingState] = useState(0);
  const [currentExportStep, setCurrentExportStep] = useState(0);
  const [maxExportStep, setMaxExportStep] = useState(100);
  const [estimatedTime, setEstimatedTime] = useState("");

  useEffect(() => {
    if (!reportData || !insight) return;

    let seconds: number = 5; // in second
    if (selectedRows.includes("image") && !otherOption.usingLinkInsteadOfImage) {
      seconds = Math.floor(reportData.length * 2.5);
    }

    if (insight.totalReportPerStatus.Complete && selectedRows.includes("image_after_finish") && !otherOption.usingLinkInsteadOfImage) {
      seconds += Math.floor(insight.totalReportPerStatus.Complete * 2.5);
    }

    const result = seconds_to_general_time(seconds);

    setEstimatedTime(result);
  }, [selectedRows, selectedOutputType, otherOption, reportData]);

  if (activeTab !== 3) {
    return <></>;
  }

  return (
    <>
      <UseReportStatisticsEffect />
      <UseReportDataHookEffect />
      <UseExportHookEffect />
      <div className="h-full w-full py-4 md:px-4 relative overflow-auto grid grid-flow-row grid-rows-[1fr_auto]">
        <div className="w-full h-full flex flex-col gap-2 md:px-1 py-2">
          <RowOptions />
          <FilterOptions />
          <DateRangeOptions />
          <OutputOptions />
          <OtherOptions />
        </div>
        {/* Export button */}
        <button
          className={`h-full mt-4 p-4 bg-[#374151] text-white rounded-2xl hover:bg-[#F97316] duration-300 ${processingState == 1 ? "bg-white text-[#1f324d]! border-[#1f324d] pointer-events-none" : ""}`}
          onClick={() => {
            setProcessingState(1);
            handleExport(setCurrentExportStep, setMaxExportStep)
              .then((downloadTrigger) => {
                setProcessingState(2);
                downloadTrigger();
                setTimeout(() => {
                  setProcessingState(0);
                  setCurrentExportStep(0);
                }, 2000);
              })
              .catch(() => {
                setCurrentExportStep(0);
                setProcessingState(0);
              });
          }}
        >
          <p className="text-xl font-bold">{processingState == 1 ? "Processing..." : processingState == 2 ? "Done!" : "Process & Export"}</p>
          {processingState == 0 && <p className="text-md font-thin">Proses ini bisa memakan waktu sampai {estimatedTime}</p>}
        </button>
        <div className={`mt-6 bg-[#374151]! flex flex-row items-center gap-2 ${processingState ? "opacity-100" : "opacity-0"}`}>
          <ProgressBar
            value={Math.round((currentExportStep / maxExportStep) * 100)}
            showValue={true}
            className={`w-full ${selectedRows.includes("image") && !otherOption.usingLinkInsteadOfImage ? "[&_.p-progressbar-value-animate]:duration-500!" : ""} [&_.p-progressbar-value-animate]:bg-transparent! [&_.p-progressbar-value-animate]:border! [&_.p-progressbar-value-animate]:border-white! bg-[#14161c]!`}
          />
          <p className="w-max min-w-max px-4 text-white">
            {currentExportStep}/{maxExportStep} laporan diproses
          </p>
        </div>
        <br />
      </div>
    </>
  );
}
