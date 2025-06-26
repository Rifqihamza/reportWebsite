import { create } from "zustand";
import type { ReportData } from "../../types/variables";
import { useEffect } from "react";
import { APIResultType, getReport } from "../../utils/api_interface";
import { useMessageToastHook } from "./useMessageToast";
import { useNetworkConnectivityHook } from "./useNetworkConnectivity";
import UseUserAccountHookEffect, { useUserAccountHook } from "../useUserAccount";

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
  const { showMessage } = useMessageToastHook();
  const { isConnected } = useNetworkConnectivityHook();

  useEffect(() => {
    if(initialized || !isConnected) {
      return;
    }
    initialized = true;

    getReport().then((report_data_array) => {
      if (typeof report_data_array === "object") {
        setReportData(report_data_array);
      }
      else if (report_data_array === APIResultType.DatabaseError) {
        showMessage("There's an error in database.", "error", "Please reload the website after a while.");
      }
    });
  }, [isConnected]);

  return <></> ;
}
