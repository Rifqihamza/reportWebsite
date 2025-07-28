import { create } from "zustand";
import type { ReportData } from "../../types/variables";
import { useEffect } from "react";
import { APIResultType, getReport } from "../../utils/api_interface";
import { useMessageToastHook } from "./useMessageToast";
import { useNetworkConnectivityHook } from "./useNetworkConnectivity";
import { useReportPaginationHook } from "../pages/ReportTable/useReportHook";

type ChunkedReportDataType = {report_data: ReportData[], is_loaded: boolean};

type UseReportDataType = {
  chunkedReportData: ChunkedReportDataType[];
  addReportChunk: () => void;
  setReportChunk: (index: number, reportData: ReportData[]) => void;
  isAuthorized: boolean;
  setIsAuthorized: (newIsAuthorized: boolean) => void
};

export const useReportDataHook = create<UseReportDataType>((set) => ({
  chunkedReportData: [],
  addReportChunk: () => {
    set((state) => ({ chunkedReportData: [...state.chunkedReportData, {is_loaded: false, report_data: []}] }));
  },
  setReportChunk: (index, reportData) => {
    set((state) => {
      const result = state.chunkedReportData;
      result[index] = {
        is_loaded: true,
        report_data: reportData
      };
      
      return { chunkedReportData: result }
    });
  },
  isAuthorized: true,
  setIsAuthorized(newIsAuthorized) {
    set(() => ({ isAuthorized: newIsAuthorized }));
  },
}));


let lastChunkedReportDataLength = 0;
export default function UseReportDataHookEffect() {
  const { chunkedReportData, setReportChunk, setIsAuthorized } = useReportDataHook();
  const { setMaxPage } = useReportPaginationHook();
  const { showMessageByAPI } = useMessageToastHook();
  const { isConnected } = useNetworkConnectivityHook();

  useEffect(() => {
    if(!isConnected) return;
    
    if(lastChunkedReportDataLength >= chunkedReportData.length) return;
    lastChunkedReportDataLength = chunkedReportData.length;

    getReport(chunkedReportData.length-1).then((result) => {
      if (typeof result === "object") {
        setMaxPage(result.max_page)
        setReportChunk(chunkedReportData.length-1, result.report_data);
      }
      else if (result === APIResultType.Unauthorized) {
        setIsAuthorized(true);
      }
      else {
        showMessageByAPI(result, "Please reload the website after a while.");
      }
    });
  }, [isConnected, chunkedReportData]);

  return <></> ;
}
