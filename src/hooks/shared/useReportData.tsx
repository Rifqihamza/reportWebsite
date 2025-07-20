import { create } from "zustand";
import type { ReportData } from "../../types/variables";
import { useEffect } from "react";
import { APIResultType, getReport } from "../../utils/api_interface";
import { useMessageToastHook } from "./useMessageToast";
import { useNetworkConnectivityHook } from "./useNetworkConnectivity";

type UseReportDataType = {
  reportData: ReportData[] | null;
  setReportData: (reportData: ReportData[] | null) => void;
  isAuthorized: boolean;
  setIsAuthorized: (newIsAuthorized: boolean) => void
  fetchReportData: () => Promise<void>; 

};

export const useReportDataHook = create<UseReportDataType>((set) => ({
  reportData: null,
  setReportData: (reportData) => {
    set(() => ({ reportData }));
  },
  isAuthorized: true,
  setIsAuthorized(newIsAuthorized) {
    set(() => ({ isAuthorized: newIsAuthorized }));
  },
  fetchReportData: async () => {
    const res = await fetch("/api/report/get"); // sesuaikan dengan endpoint kamu
    const data = await res.json();
    set(() => ({ reportData: data }));
  }
}));


let initialized = false;

export default function UseReportDataHookEffect() {
  const { setReportData, setIsAuthorized } = useReportDataHook();
  const { showMessageByAPI } = useMessageToastHook();
  const { isConnected } = useNetworkConnectivityHook();

  useEffect(() => {
    if (initialized || !isConnected) {
      return;
    }
    initialized = true;

    getReport().then((result) => {
      if (typeof result === "object") {
        setReportData(result);
      }
      else if (result === APIResultType.Unauthorized) {
        setIsAuthorized(true);
      }
      else {
        showMessageByAPI(result, "Please reload the website after a while.");
      }
    });
  }, [isConnected]);

  return <></>;
}
