import { create } from "zustand";
import { Campus, ExportOutputType, ReportStatus, ReportType, reporttype_to_string, table_rows, type ReportData } from "../../../types/variables";
import { useEffect } from "react";

export const filterOptions: Partial<{
  [key in keyof ReportData]: string[];
}> = {
  status: Object.values(ReportStatus),
  type: Object.values(ReportType).map((value) => reporttype_to_string(value)),
  campus: Object.values(Campus),
};

type UseExportType = {
  selectedRows: (keyof ReportData)[];
  selectedOutputType: ExportOutputType;
  dateRange: (Date | null)[];
  filter: Partial<{
    [key in keyof ReportData]: string[];
  }>;

  setRow: (newRow: (keyof ReportData)[]) => void;
  toggleAllRow: () => void;

  setSelectedOutput: (output: ExportOutputType) => void;

  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setDateRange: (newRangeDate: (Date | null)[]) => void;

  setFilter: (key: keyof ReportData, value: string[]) => void;
};

export const useExportHook = create<UseExportType>((set) => {
  return {
    // Default values
    selectedRows: Object.values(table_rows),
    selectedOutputType: ExportOutputType.CSV,
    dateRange: [null, null],
    filter: { ...filterOptions, key: [""] },

    // Row Functionality
    setRow(newRow) {
      set(() => ({ selectedRows: newRow }));
    },
    toggleAllRow() {
      set((state) => {
        const result = state.selectedRows;

        // If the row that user wants to insert is already in result
        if (result.length === Object.values(table_rows).length) {
          // Remove all of the row
          return {
            selectedRows: [],
          };
        }

        // If not, add the row
        return {
          selectedRows: Object.values(table_rows) as (keyof ReportData)[],
        };
      });
    },

    // Output Functionality
    setSelectedOutput(output) {
      set(() => ({
        selectedOutputType: output,
      }));
    },

    // Date Range Functionalities
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

    setFilter(key, value) {
      set((state) => {
        const result = state.filter;
        result[key] = value;

        return {
          filter: result,
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
