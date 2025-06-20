import strftime from "strftime";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";
import UseReportDataHookEffect, { useReportDataHook } from "../../../hooks/shared/useReportData";
import { useExportHook } from "../../../hooks/useExportHook";
import { ExportOutputType, table_rows, type ReportData } from "../../../types/variables";
import DateRangeOptions from "./DateRangeOptions";
import OutputOptions from "./OutputOptions";
import RowOptions from "./RowOptions";
import * as XLSX from 'xlsx';
import FilterOptions from "./FilterOptions";
import { useState } from "react";

export default function ExportComponent() {
  const { reportData } = useReportDataHook();
  const { dateRange, selectedOutputType, selectedRows } = useExportHook();
  const { showMessage } = useMessageToastHook();
  
  const [processingState, setProcessingState] = useState(0);
  

  const handleExport = async () => {
    setProcessingState(1);
    
    // Check if report data is empty
    if (!reportData) {
      showMessage("Data dalam keadaan kosong.", "warn", "");
      return;
    }

    // Check if there's no rows selected
    if (selectedRows.length === 0) {
      showMessage("Pilih minimal satu opsi barisan.", "warn", "");
      return;
    }

    const filteredReportData: ReportData[] = reportData.filter((value) => {
      const startDatePassed = dateRange[0] ? dateRange[0] <= new Date(value.created_at) : true;
      const endDatePassed = dateRange[1] ? dateRange[1] >= new Date(value.created_at) : true;

      return startDatePassed && endDatePassed;
    });

    // Filter out rows
    const resultData: string[][] = [["No.", ...(selectedRows as string[])], ...(filteredReportData.map((value, index) => {
      let result: string[] = [(index + 1).toString()];
      selectedRows.forEach((row) => {
        result.push(value[table_rows[row]] ?? "");
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
      const csvContent = (resultData.map((value) => value.join(",")).join("\n"));
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

  return (
    <>
      <UseReportDataHookEffect />
      <div className="h-full w-full p-4 bg-white rounded-2xl relative overflow-auto grid grid-flow-row grid-rows-[1fr_auto]">
        <div className="w-full h-full flex flex-row gap-4 px-1 py-4">
          <div className="w-full h-full flex flex-col md:flex-row gap-4">
            <RowOptions />
            <FilterOptions />
            <div className="w-full h-full flex flex-col gap-4">
              <DateRangeOptions />
              <OutputOptions />
            </div>
          </div>
        </div>
        {/* Export button */}
        <button className={`h-full p-4 bg-[#1f324d] border-2 text-white rounded-2xl hover:brightness-75 ${(processingState == 1) ? "bg-white text-[#1f324d]! border-[#1f324d] pointer-events-none" : ""}`} onClick={handleExport}>
          {(processingState == 1) ? "Processing..." : ((processingState == 2) ? "Done!" : "Process & Export")}
        </button>
      </div>
    </>
  );
}
