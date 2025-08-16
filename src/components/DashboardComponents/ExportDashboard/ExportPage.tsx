import UseReportDataHookEffect from "../../../hooks/shared/useReportData";
import UseExportHookEffect, { handleExport } from "../../../hooks/pages/Export/useExportHook";
import DateRangeOptions from "./options/DateRangeOptions";
import OutputOptions from "./options/OutputOptions";
import RowOptions from "./options/RowOptions";
import FilterOptions from "./options/FilterOptions";
import { useState } from "react";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import OtherOptions from "./options/OtherOptions";

export default function ExportPage() {
  const { activeTab } = useDashboardNavbarHook();

  const [processingState, setProcessingState] = useState(0);

  if (activeTab !== 3) {
    return <></>;
  }

  return (
    <>
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
          className={`h-full mt-4 p-4 bg-[#374151] text-white rounded-2xl hover:bg-[#F97316] duration-300 ${(processingState == 1) ? "bg-white text-[#1f324d]! border-[#1f324d] pointer-events-none" : ""}`}
          onClick={() => {
            setProcessingState(1);
            handleExport().then((downloadTrigger) => {
              setProcessingState(2);
              downloadTrigger();
              setTimeout(() => {
                setProcessingState(0);
              }, 2000);
            }).catch(() => {
              setProcessingState(0);
            });
          }}
          >
          {(processingState == 1) ? "Processing..." : ((processingState == 2) ? "Done!" : "Process & Export")}
        </button>
        <br />
      </div>
    </>
  );
}
