import { create } from "zustand";
import { Campus, exportable_rows, ExportOutputType, ReportStatus, ReportType, reporttype_to_string, type ReportData } from "../../../types/variables";
import { useEffect } from "react";
import { useMessageToastHook } from "../../shared/useMessageToast";

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
    filter: { ...filterOptions, key: [""] },
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
