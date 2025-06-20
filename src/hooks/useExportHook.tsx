import { create } from "zustand"
import { ExportOutputType, table_rows, type ReportData } from "../types/variables";
import { useEffect } from "react";

type UseExportType = {
  selectedRows: (keyof ReportData)[],
  selectedOutputType: ExportOutputType,
  dateRange: (Date|null)[],
  filter: {
    [key in (keyof ReportData)]: string
  }|null,

  toggleRow: (row: keyof ReportData) => void,
  toggleAllRow: () => void,
  
  setSelectedOutput: (output: ExportOutputType) => void,
  
  setStartDate: (date: Date|null) => void,
  setEndDate: (date: Date|null) => void,
  setDateRange: (newRangeDate: (Date|null)[]) => void
}

export const useExportHook = create<UseExportType>((set) => {
  return {
    // Default values
    selectedRows: [],
    selectedOutputType: ExportOutputType.CSV,
    dateRange: [null, null],
    filter: null,

    // Row Functionality
    toggleRow(row) {
        set((state) => {
          const result = state.selectedRows;

          // If the row that user wants to insert is already in result
          if(result.includes(row)) {
            // Remove the row
            return {
              selectedRows: result.filter((value) => value !== row)
            };
          }
          
          // If not, add the row
          return {
            selectedRows: [...result, row]
          }
        });
    },

    toggleAllRow() {
        set((state) => {
          const result = state.selectedRows;

          // If the row that user wants to insert is already in result
          if(result.length === Object.values(table_rows).length) {
            // Remove all of the row
            return {
              selectedRows: []
            };
          }
          
          // If not, add the row
          return {
            selectedRows: (Object.keys(table_rows) as (keyof ReportData)[])
          }
        });
    },

    // Output Functionality
    setSelectedOutput(output) {
        set(() => ({
          selectedOutputType: output
        }));
    },
    
    // Date Range Functionalities
    setStartDate(date) {
        set((state) => {
          const result = state.dateRange;
          result[0] = date;
          
          return {
            dateRange: result
          }
        })
    },
    setEndDate(date) {
        set((state) => {
          const result = state.dateRange;
          result[1] = date;
          
          return {
            dateRange: result
          }
        })
    },
    setDateRange(newDateReport) {
        set(() => ({
          dateRange: newDateReport
        }))
    },
  }
})

export default function UseExportHookEffect() {
  const { selectedRows, dateRange, setDateRange } = useExportHook();

  // Prevent error in date range
  useEffect(() => {
    if(dateRange.length !== 2) {
      setDateRange([null, null])
    }
  }, [dateRange]);

  return <></>;
}