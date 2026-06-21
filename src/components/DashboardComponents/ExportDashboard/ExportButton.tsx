import { useReportDataHook } from "../../../hooks/shared/useReportData";
import { handleExport, useExportHook } from "../../../hooks/pages/Export/useExportHook";
import { useEffect, useState } from "react";
import { useDashboardSidebarHook } from "../../../hooks/shared/useDashboardSidebar";
import { seconds_to_general_time } from "../../../utils/other";
import { useInsightHook } from "../../../hooks/pages/Statistics/useReportStatisticsHook";

export default function ExportPage() {
  const { selectedOutputType, otherOption, selectedRows, setCurrentExportStep, setProcessingState, processingState } = useExportHook();
  const { reportData } = useReportDataHook();
  const { insight } = useInsightHook();

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

  return (
    <>
      <button
        className={`h-full mt-4 p-4 bg-[#374151] text-white rounded-2xl hover:bg-[#F97316] duration-300 ${processingState == 1 ? "bg-white text-[#1f324d]! border-[#1f324d] pointer-events-none" : ""}`}
        onClick={() => {
          setProcessingState(1);
          handleExport()
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
              3;
            });
        }}
      >
        <p className="text-xl font-bold">{processingState == 1 ? "Processing..." : processingState == 2 ? "Done!" : "Process & Export"}</p>
        {processingState == 0 && <p className="text-md font-thin">Proses ini bisa memakan waktu sampai {estimatedTime}</p>}
      </button>
    </>
  );
}
