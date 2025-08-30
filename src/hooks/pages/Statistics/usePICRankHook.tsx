import { create } from "zustand"
import { useEffect } from "react";
import UseReportDataHookEffect, { useReportDataHook } from "../../shared/useReportData";
import { ReportStatus } from "../../../types/variables";
import { usePICReportCountHook } from "./usePICReportCountHook";
import { usePICFilterHook } from "./usePICFilterHook";
import UseReportConfigHookEffect, { useReportConfigHook } from "../../shared/useReportConfig";

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
  showedPICRank: PICData[];
  setShowedPICRank: (newShowedPICRank: PICData[]) => void;

  sortedPICData: PICData[];
  setSortedPICData: (newSortedPICData: PICData[]) => void;

  page: number;
  setPage: (newPage: number) => void;

  maxPage: number,
  medianReportData: number,
}

export const usePICRankHook = create<usePICRankHookType>((set) => ({
  showedPICRank: [],
  setShowedPICRank: (newShowedPICData) => (set(() => ({ showedPICRank: newShowedPICData }))),

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
  setPage: (newPage) => {
    const { maxPage } = usePICRankHook.getState();
    if(newPage < 1 || newPage > maxPage) {
      return;
    }

    set(() => ({ page: newPage }));
  },

  maxPage: 1,
  medianReportData: 1
}));



export default function UsePICRankHookEffect() {
  const { picNamesOptions } = useReportConfigHook();
  const { setShowedPICRank, setSortedPICData, page, maxPage, sortedPICData } = usePICRankHook();
  const { reportData } = useReportDataHook();
  const { currentTimeSpan, startDateFilter, endDateFilter } = usePICFilterHook();
   
  // Report data processing to get the sorted PIC Rank
  useEffect(() => {
    if(!picNamesOptions || !reportData) return;
    const result: IndexedPICData = {};

    picNamesOptions.forEach((picName) => {
      result[picName] = {
        name: picName,
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
    
    reportData.forEach((data) => {
      // If the report doesn't have PIC just yet.
      if(!data.pic_name) return;

      // If there's no recorded data in the PIC database with the name as same as in the report data
      if(!Object.keys(result).includes(data.pic_name)) return;

      // Filter Date
      if(!(new Date(data.created_at) >= startDateFilter && new Date(data.created_at) <= endDateFilter)) return;
      
      result[data.pic_name].reportCountByStatus[data.status] += 1;
      result[data.pic_name].reportCountTotal += 1;
    });

    // Sort by report count total
    const newSortedPICData = Object.values(result).sort((a, b) => b.reportCountTotal - a.reportCountTotal).map((data, index) => ({ ...data, rank: (index + 1) }));

    setSortedPICData(newSortedPICData);
  }, [picNamesOptions, reportData, startDateFilter, endDateFilter, currentTimeSpan]);

  // Pagination handler
  useEffect(() => {
    if(page < 1 || page > maxPage) {
      return
    }
    setShowedPICRank(sortedPICData.slice((page-1)*maxPICRankPerPage, page*maxPICRankPerPage));
  }, [page, sortedPICData])
  
  return <>
    <UseReportDataHookEffect />
    <UseReportConfigHookEffect />
  </>;
}
