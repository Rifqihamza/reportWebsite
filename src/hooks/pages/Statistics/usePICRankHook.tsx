import { create } from "zustand"
import UseUserAccountHookEffect, { useUserAccountHook } from "../UsersTab/useUserAccount";
import { useEffect } from "react";
import UseReportDataHookEffect, { useReportDataHook } from "../../shared/useReportData";
import { ReportStatus } from "../../../types/variables";
import { usePICReportCountHook } from "./usePICReportCountHook";

const maxPICRankPerPage = 10;

type PICData = {
  name: string,
  rank: number,
  reportCountByStatus: {
    [key in ReportStatus]: number
  },
  reportCountTotal: number
}

type IndexedPICData = {
  [name: string]: PICData
};

type usePICRankHookType = {
  showedPICData: PICData[];
  setShowedPICData: (newShowedPICData: PICData[]) => void;

  sortedPICData: PICData[];
  setSortedPICData: (newSortedPICData: PICData[]) => void;

  page: number;
  setPage: (newPage: number) => void;

  maxPage: number,
  medianReportData: number,
}

export const usePICRankHook = create<usePICRankHookType>((set) => ({
  showedPICData: [],
  setShowedPICData: (newShowedPICData) => (set(() => ({ showedPICData: newShowedPICData }))),

  sortedPICData: [],
  setSortedPICData: (newSortedPICData) => (set(() => {
    if(newSortedPICData[0]) {
      const { setMaxValue } = usePICReportCountHook.getState();
      setMaxValue(Math.ceil(newSortedPICData[0].reportCountTotal / 5) * 5);
    }

    const median_index = Math.floor(newSortedPICData.length / 2);
    let newMedianReportData = 1;
    if(median_index > 0 && newSortedPICData.length > median_index) {
      newMedianReportData = newSortedPICData.length % 2 == 0 ? (newSortedPICData[median_index-1].reportCountTotal+newSortedPICData[median_index+1].reportCountTotal / 2) : newSortedPICData[Math.floor(newSortedPICData.length / 2)].reportCountTotal
    }

    return {
      sortedPICData: newSortedPICData,
      maxPage: Math.ceil(newSortedPICData.length/maxPICRankPerPage),
      medianReportData: newMedianReportData
    };
  })),

  page: 1,
  setPage: (newPage) => (set(() => ({ page: newPage }))),

  maxPage: 1,
  medianReportData: 1
}));



export default function UsePICRankHookEffect() {
  const { userAccountData } = useUserAccountHook();
  const { setShowedPICData, setSortedPICData, page, maxPage, sortedPICData } = usePICRankHook();
  const { reportData } = useReportDataHook();
   
  useEffect(() => {
    if(!userAccountData || !reportData) return;
    const result: IndexedPICData = {};

    userAccountData.forEach((picData, index) => {
      result[picData.username] = {
        name: picData.username,
        rank: 0,
        reportCountTotal: 0,
        reportCountByStatus: {
          Complete: 0,
          Hold: 0,
          InProcess: 0,
          NotStarted: 0
        }
      }
    });
    
    reportData.forEach((data, index) => {
      // If the report doesn't have PIC just yet.
      if(!data.pic_name) return;

      // If there's no recorded data in the PIC database with the name as same as in the report data
      if(!Object.keys(result).includes(data.pic_name)) return;
      
      result[data.pic_name].reportCountByStatus[data.status] += 1;
      result[data.pic_name].reportCountTotal += 1;
    });

    const newSortedPICData = Object.values(result).sort((a, b) => b.reportCountTotal - a.reportCountTotal).map((data, index) => ({ ...data, rank: (index + 1) }));

    setSortedPICData(newSortedPICData);
  }, [userAccountData, reportData]);

  useEffect(() => {
    if(page < 1 || page > maxPage) {
      return
    }
    setShowedPICData(sortedPICData.slice((page-1)*maxPICRankPerPage, page*maxPICRankPerPage));
  }, [page, sortedPICData])
  
  return <>
    <UseReportDataHookEffect />
    <UseUserAccountHookEffect />
  </>;
}
