import { create } from "zustand";
import { Campus, exportable_rows, ExportOutputType, keyto_table_rows, ReportStatus, ReportType, reporttype_to_string, type ReportData } from "../../../types/variables";
import { useEffect } from "react";
import { useMessageToastHook } from "../../shared/useMessageToast";
import { useReportDataHook } from "../../shared/useReportData";
import strftime from "strftime";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable";

export const filterOptions: Partial<{
  [key in keyof ReportData]: string[];
}> = {
  status: Object.values(ReportStatus),
  type: Object.values(ReportType).map((value) => reporttype_to_string(value)),
  campus: Object.values(Campus),
};

export type otherOptionsType = {
  usingLinkInsteadOfImage: boolean;
};

type UseExportType = {
  selectedRows: (keyof ReportData)[];
  selectedOutputType: ExportOutputType;
  dateRange: (Date | null)[];
  filter: Partial<{
    [key in keyof ReportData]: string[];
  }>;
  maxExportedData: number;
  otherOption: otherOptionsType;

  setRow: (newRow: (keyof ReportData)[]) => void;
  toggleAllRow: () => void;

  setSelectedOutput: (output: ExportOutputType) => void;

  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setDateRange: (newRangeDate: (Date | null)[]) => void;

  setFilter: (key: keyof ReportData, value: string[]) => void;

  setMaxExportedData: (newValue: number) => void;
  setOtherOption: (key: keyof otherOptionsType, newValue: string | number | boolean) => void;
};

export const useExportHook = create<UseExportType>((set) => {
  return {
    // Row Functionality
    selectedRows: Object.values(exportable_rows),
    setRow(newRow) {
      set(() => ({ selectedRows: newRow }));
    },
    toggleAllRow() {
      set((state) => {
        const result = state.selectedRows;

        // If the row that user wants to insert is already in result
        if (result.length === Object.values(exportable_rows).length) {
          // Remove all of the row
          return {
            selectedRows: [],
          };
        }

        // If not, add the row
        return {
          selectedRows: Object.values(exportable_rows) as (keyof ReportData)[],
        };
      });
    },

    // Output Functionality
    selectedOutputType: ExportOutputType.CSV,
    setSelectedOutput(output) {
      set(() => ({
        selectedOutputType: output,
      }));
    },

    // Date Range Functionalities
    dateRange: [null, null],
    setStartDate(date) {
      set((state) => {
        const result = state.dateRange;
        result[0] = date;

        return {
          dateRange: result,
        };
      });
    },
    setEndDate(date) {
      set((state) => {
        const result = state.dateRange;
        result[1] = date;

        return {
          dateRange: result,
        };
      });
    },
    setDateRange(newDateReport) {
      set(() => ({
        dateRange: newDateReport,
      }));
    },

    // Filter Functionalities
    filter: {},
    setFilter(key, value) {
      set((state) => {
        const result = state.filter;
        result[key] = value;

        return {
          filter: result,
        };
      });
    },

    // Max Report Functionalitiies
    maxExportedData: 0,
    setMaxExportedData(newValue) {
      set((state) => {
        if (state.selectedRows.includes("image") && !state.otherOption.usingLinkInsteadOfImage && newValue > 50) {
          const { showMessage } = useMessageToastHook();
          showMessage("Laporan lebih dari 50!", "warn", "Jika menggunakan gambar, pengunduhan data akan memakan waktu lebih lama");
        }

        return {
          maxExportedData: newValue,
        };
      });
    },

    otherOption: {
      usingLinkInsteadOfImage: false,
    },
    setOtherOption(key, newValue) {
      set((state) => {
        const currentState = state.otherOption;
        if (typeof currentState[key] == typeof newValue) {
          currentState[key] = newValue as any;
        }

        return {
          otherOption: currentState,
        };
      });
    },
  };
});

export default function UseExportHookEffect() {
  const { dateRange, setDateRange } = useExportHook();

  // Prevent error in date range
  useEffect(() => {
    if (dateRange.length !== 2) {
      setDateRange([null, null]);
    }
  }, [dateRange]);

  return <></>;
}

export const handleExport = async (setCurrentStep: (step: number) => void, setMaxStep: (maxStep: number) => void) => {
  const { dateRange, selectedOutputType, selectedRows, filter, otherOption } = useExportHook.getState();
  const { showMessage } = useMessageToastHook.getState();
  const { reportData } = useReportDataHook.getState();

  // Check if report data is empty
  if (!reportData) {
    showMessage("Data dalam keadaan kosong.", "warn", "");
    throw Error();
  }

  // Check if there's no rows selected
  if (selectedRows.length === 0) {
    showMessage("Pilih minimal satu opsi barisan.", "warn", "");
    throw Error();
  }

  const filteredReportData: ReportData[] = reportData.filter((data) => {
    //? Filter date
    const reportDate = new Date(data.created_at);
    const startDatePassed = dateRange[0] ? dateRange[0] <= reportDate : true;
    const endDatePassed = dateRange[1] ? new Date(dateRange[1].valueOf() + 1000 * 60 * 60 * 24) >= reportDate : true;

    //? Filter value
    const valueFilterPassed = !Object.keys(filter)
      .map((key) => filter[key as keyof ReportData]?.includes(reporttype_to_string(data[key as keyof ReportData] ?? "")))
      .includes(false);

    //? Return the filter
    return startDatePassed && endDatePassed && valueFilterPassed;
  });

  // Filter out rows
  const resultData: string[][] = [
    ["No.", ...(selectedRows.map((value) => keyto_table_rows[value]) as string[])],
    ...filteredReportData.map((value, index) => {
      let result: string[] = [(index + 1).toString()];
      selectedRows.forEach((row) => {
        result.push((row === "type" ? reporttype_to_string(value[row]) : value[row]?.toString()) ?? "");
      });
      return result;
    }),
  ];

  setMaxStep(resultData.length);

  const file_name = `DataReport_${strftime("%d-%m-%Y", new Date())}`;

  await new Promise((res, rej) => {
    setTimeout(() => {
      res(true);
    }, 100 * selectedRows.length + Math.random() * 1000);
  });

  // Output the result depends on the selected output file type
  
  // ---- CSV ----
  if (selectedOutputType === ExportOutputType.CSV) {
    const csvContent = resultData.map((value) => value.map((value2) => `"${value2}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${file_name}.csv`;

    return () => {
      setCurrentStep(resultData.length);
      a.click(); // Trigger Download
      URL.revokeObjectURL(url);
    };
  } 
  
  // ---- EXCEL ----
  else if (selectedOutputType === ExportOutputType.Excel) {
    const worksheet = XLSX.utils.aoa_to_sheet(
      resultData.map((row_value, row_index) =>
        row_index == 0 ? row_value : row_value.map((col_value, col_index) => (selectedRows[col_index - 1] == "created_at" ? strftime("%d/%M/%Y", new Date(col_value)) : col_value))
      )
    );
    const workbook = XLSX.utils.book_new(); // Create new excel file
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // Add sheet

    return () => {
      setCurrentStep(resultData.length);
      XLSX.writeFile(workbook, `${file_name}.xlsx`); // Trigger download
    };
  } 
  
  // ---- PDF ----
  else if (selectedOutputType === ExportOutputType.PDF) {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a1"
    });

    const bodyResult = resultData.slice(1);
    const image_index = selectedRows.indexOf("image") + 1;

    if(image_index && !otherOption.usingLinkInsteadOfImage) {
      // Convert image URL to base64
      const toBase64 = async (url: string) => {
        const res = await fetch(url, { mode: "cors" });
        const blob = await res.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      };
  
      // Generate table
      let current_step = 0;
      const max_step = bodyResult.length;

      for(let index1 = 0; index1 < bodyResult.length; index1++) {
        for(let index2 = 0; index2 < bodyResult[index1].length; index2++) {
          if(index2 !== image_index) continue;

          setCurrentStep(current_step);
          bodyResult[index1][index2] = { image: await toBase64(bodyResult[index1][index2]) } as any;
          
          current_step++;
          await new Promise((res, rej) => {
            setTimeout(() => {
              res(true);
            }, (Math.floor(Math.random() * 1) * 1000) + 500); // 0.5-2.5 seconds of interval
          })
        }
      }
    }
    else {
      setCurrentStep(50);
    }
    
    autoTable(pdf, {
      head: [resultData[0]],
      body: bodyResult,
      rowPageBreak: "avoid",
      headStyles: {
        fontStyle: "bold"
      },
      styles: {
        fontSize: 20
      },
      bodyStyles: {
        minCellHeight: 75,
        cellWidth: 75,
      },
      didDrawCell: (data) => {
        if(!image_index || otherOption.usingLinkInsteadOfImage || data.column.index == 0) return;
        // Insert image manually into the right cell
        if (image_index === data.column.index) {
          const raw = data.cell.raw as any
          if(raw.image) {
            pdf.addImage(
              raw.image,
              "PNG",
              data.cell.x + 2,
              data.cell.y + 2,
              data.column.width - 4, // width
              data.row.height - 4  // height
            );
          }
        }
      },
    });

    return () => {
      setCurrentStep(100);
      pdf.save(`${file_name}.pdf`);
    };
  }

  throw Error();
};
