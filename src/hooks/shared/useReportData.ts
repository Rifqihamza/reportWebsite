import { create } from "zustand";
import type { ReportData } from "../../types/variables";

type UseReportDataType = {
  reportData: ReportData[];
  setReportData: (reportData: ReportData[]) => void;
}

export const useReportDataHook = create<UseReportDataType>((set) => ({
  reportData: [],
  setReportData: (reportData) => {set(() => ({ reportData: reportData }))}
}));


