import { create } from "zustand";
import type { ReportData } from "../../types/variables";
import { useEffect } from "react";
import { getReport } from "../../utils/api_interface";

type UseReportDataType = {
  reportData: ReportData[] | null;
  setReportData: (reportData: ReportData[] | null) => void;
};

export const useReportDataHook = create<UseReportDataType>((set) => ({
  reportData: null,
  setReportData: (reportData) => {
    set(() => ({ reportData: reportData }));
  },
}));

let initialized = false;

export default function UseReportDataHookEffect() {
  const { setReportData } = useReportDataHook();

  useEffect(() => {
    if(initialized) {
      return;
    }
    initialized = true;

    getReport().then((report_data_array) => {
      if (typeof report_data_array === "object") {
        setReportData(report_data_array);
      }
    });
  }, []);

  return <></>;
}
