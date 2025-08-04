import strftime from "strftime";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";
import UseReportDataHookEffect, { useReportDataHook } from "../../../hooks/shared/useReportData";
import UseExportHookEffect, { useExportHook } from "../../../hooks/pages/Export/useExportHook";
import { ExportOutputType, keyto_table_rows, reporttype_to_string, type ReportData } from "../../../types/variables";
import DateRangeOptions from "./options/DateRangeOptions";
import OutputOptions from "./options/OutputOptions";
import RowOptions from "./options/RowOptions";
import * as XLSX from 'xlsx';
import FilterOptions from "./options/FilterOptions";
import { useState } from "react";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";

export default function ExportPage() {
  const { activeTab } = useDashboardNavbarHook();
  const { reportData } = useReportDataHook();
  const { dateRange, selectedOutputType, selectedRows, filter } = useExportHook();
  const { showMessage } = useMessageToastHook();

  const [processingState, setProcessingState] = useState(0);


  const handleExport = async () => {
    setProcessingState(1);

    // Check if report data is empty
    if (!reportData) {
      showMessage("Data dalam keadaan kosong.", "warn", "");
      setProcessingState(0);
      return;
    }

    // Check if there's no rows selected
    if (selectedRows.length === 0) {
      showMessage("Pilih minimal satu opsi barisan.", "warn", "");
      setProcessingState(0);
      return;
    }

    const filteredReportData: ReportData[] = reportData.filter((data) => {
      //? Filter date
      const reportDate = new Date(data.created_at);
      const startDatePassed = dateRange[0] ? dateRange[0] <= reportDate : true;
      const endDatePassed = dateRange[1] ? new Date(dateRange[1].valueOf() + 1000 * 60 * 60 * 24) >= reportDate : true;

      //? Filter value
      const valueFilterPassed = !(Object.keys(filter).map((key) => filter[key as keyof ReportData]?.includes(reporttype_to_string(data[key as keyof ReportData] ?? ""))).includes(false));

      //? Return the filter
      return startDatePassed && endDatePassed && valueFilterPassed;
    });

    // Filter out rows
    const resultData: string[][] = [["No.", ...(selectedRows.map((value) => keyto_table_rows[value]) as string[])], ...(filteredReportData.map((value, index) => {
      let result: string[] = [(index + 1).toString()];
      selectedRows.forEach((row) => {
        result.push((row === "type" ? reporttype_to_string(value[row]) : value[row]?.toString()) ?? "");
      })
      return result;
    }))]

    const file_name = `DataReport_${strftime("%d-%m-%Y", new Date())}`;

    await (new Promise((res, rej) => {
      setTimeout(() => {
        res(true);
      }, ((100 * selectedRows.length) + Math.random() * 1000));
    }))

    setProcessingState(2);
    setTimeout(() => {
      setProcessingState(0);
    }, 1000);

    // Output the result depends on the selected output file type
    if (selectedOutputType === ExportOutputType.CSV) {
      const csvContent = (resultData.map((value) => value.map(value2 => `"${value2}"`).join(",")).join("\n"));
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);


      const a = document.createElement("a");
      a.href = url;
      a.download = `${file_name}.csv`;
      a.click();

      URL.revokeObjectURL(url);
    }
    else if (selectedOutputType == ExportOutputType.Excel) {
      const worksheet = XLSX.utils.aoa_to_sheet(resultData.map((value, index) => {
        const result = value;

        if (index > 0) {
          result[0] = strftime("%d/%m/%Y", new Date(result[0]));
        }

        return result;
      }));         // 2D array to worksheet
      const workbook = XLSX.utils.book_new();                  // Create workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      XLSX.writeFile(workbook, `${file_name}.xlsx`);                      // Triggers download
    }
  };

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
        </div>
        {/* Export button */}
        <button className={`h-full mt-4 p-4 bg-[#374151] text-white rounded-2xl hover:bg-[#F97316] duration-300 ${(processingState == 1) ? "bg-white text-[#1f324d]! border-[#1f324d] pointer-events-none" : ""}`} onClick={handleExport}>
          {(processingState == 1) ? "Processing..." : ((processingState == 2) ? "Done!" : "Process & Export")}
        </button>
        <br />
      </div>
    </>
  );
}
