import { create } from "zustand"
import UseUserAccountHookEffect, { useUserAccountHook } from "../UsersTab/useUserAccount";
import { useEffect } from "react";
import UseReportDataHookEffect, { useReportDataHook } from "../../shared/useReportData";
import { ReportStatus } from "../../../types/variables";

type PICData = {
  [name: string]: {
    reportCountByStatus: {
      [key in ReportStatus]: number
    },
    reportCountTotal: number
  },
}

type usePICRankHookType = {
  showedPICData: PICData,
  setShowedPICData: (newShowedPICData: PICData) => void
}

export const usePICRankHook = create<usePICRankHookType>((set) => ({
  showedPICData: {},
  setShowedPICData: (newShowedPICData) => (set((state) => ({ showedPICData: newShowedPICData }))),
}));


let initialized = false;

export default function UsePICRankHookEffect() {
  const { userAccountData } = useUserAccountHook();
  const { setShowedPICData } = usePICRankHook();
  const { reportData } = useReportDataHook();
   
  useEffect(() => {
    if(!userAccountData || !reportData || initialized) return;
    const result: PICData = {};

    reportData.forEach((data, index) => {
      if(!data.pic_name) return;
      if(Object.keys(result).includes(data.pic_name)) {
        result[data.pic_name].reportCountByStatus[data.status] += 1;
        result[data.pic_name].reportCountTotal += 1;
      }
      else {
        result[data.pic_name] = {
          reportCountByStatus: {
            Complete: data.status === ReportStatus.Complete ? 1 : 0,
            Hold: data.status === ReportStatus.Hold ? 1 : 0,
            InProcess: data.status === ReportStatus.InProcess ? 1 : 0,
            NotStarted: data.status === ReportStatus.NotStarted ? 1 : 0
          },
          reportCountTotal: 1
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
