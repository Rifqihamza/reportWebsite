import { create } from "zustand"
import UseUserAccountHookEffect, { useUserAccountHook } from "../UsersTab/useUserAccount";
import { useEffect } from "react";
import UseReportDataHookEffect, { useReportDataHook } from "../../shared/useReportData";

type PICRankData = {
  [name: string]: {
    reportCount: number
  },
}

type usePICRankHookType = {
  showedPICData: PICRankData,
  setShowedPICData: (newShowedPICData: PICRankData) => void
}

export const usePICRankHook = create<usePICRankHookType>((set) => ({
  showedPICData: {},
  setShowedPICData: (newShowedPICData) => (set((state) => ({ showedPICData: newShowedPICData }))),
}));


let initialized = false;

export default function UsePICRankHook() {
  const { userAccountData } = useUserAccountHook();
  const { setShowedPICData } = usePICRankHook();
  const { reportData } = useReportDataHook();
   
  useEffect(() => {
    if(!userAccountData || !reportData || initialized) return;
    const result: PICRankData = {};

    reportData.forEach((data, index) => {
      if(!data.pic_name) return;
      if(Object.keys(result).includes(data.pic_name)) {
        result[data.pic_name].reportCount += 1;
      }
      else {
        result[data.pic_name] = {
          reportCount: 1
        };
      }
    });

    initialized = true;
    setShowedPICData(result);
  }, [userAccountData, reportData]);

  return <>
    <UseReportDataHookEffect />
    <UseUserAccountHookEffect />
  </>;
}
