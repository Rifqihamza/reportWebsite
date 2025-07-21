import { create } from "zustand";
import { useEffect } from "react";
import UsePICRankHookEffect, { usePICRankHook } from "./usePICRankHook";

const maxPICReportCountPerPage = 15;

type usePICReportCountType = {
  picReportCountSeries: ApexAxisChartSeries;
  setPICReportCountSeries: (newPICReportCountSeries: ApexAxisChartSeries) => void;

  picReportCountNames: string[];
  setPICReportCountNames: (newPICReportCountNames: string[]) => void;

  page: number;
  setPage: (newPage: number) => void;
  
  maxPage: number;
  setMaxPage: (newMaxPage: number) => void;

  maxValue: number;
  setMaxValue: (newMaxValue: number) => void;
};

export const usePICReportCountHook = create<usePICReportCountType>((set) => {
  return {
    picReportCountSeries: [
      {
        name: "Completed",
        data: [],
      },
      {
        name: "Hold",
        data: [],
      },
      {
        name: "Not Started",
        data: [],
      },
      {
        name: "In Process",
        data: [],
      },
    ],
    setPICReportCountSeries: (newPICReportCountSeries) => set((state) => ({ picReportCountSeries: newPICReportCountSeries })),
    
    picReportCountNames: [],
    setPICReportCountNames: (newPICReportCountNames) => set((state) => ({ picReportCountNames: newPICReportCountNames })),

    page: 1,
    setPage: (newPage) => set((state) => {
      const { maxPage } = usePICReportCountHook.getState();
      
      if(newPage < 1) {
        newPage = 1;
      }
      else if(newPage > maxPage) {
        newPage = maxPage;
      }
        
      return {
        page: newPage
      };
    }),

    maxPage: 1,
    setMaxPage: (newMaxPage) => set(() => ({ maxPage: newMaxPage })),

    maxValue: 1,
    setMaxValue: (newMaxValue) => set(() => ({ maxValue: newMaxValue }))
  };
});


export default  function UsePICReportCountHookEffect() {
  const { sortedPICData } = usePICRankHook();
  const { setPICReportCountSeries, setPICReportCountNames, setMaxPage, page } = usePICReportCountHook();

  useEffect(() => {
    if(!sortedPICData || page == 0) return;
    setMaxPage(sortedPICData.length / maxPICReportCountPerPage);

    const resultSeries: {
      name: string,
      data: number[]
    }[] = [
      {
        name: "Completed",
        data: [],
      },
      {
        name: "Hold",
        data: [],
      },
      {
        name: "Not Started",
        data: [],
      },
      {
        name: "In Process",
        data: [],
      }
    ];
    const resultNames: string[] = [];

    sortedPICData.slice((page-1)*maxPICReportCountPerPage, page*maxPICReportCountPerPage).forEach((picData, index) => {
      resultNames.push(picData.name);
      resultSeries[0].data.push(picData.reportCountByStatus["Complete"]);
      resultSeries[1].data.push(picData.reportCountByStatus["Hold"]);
      resultSeries[2].data.push(picData.reportCountByStatus["NotStarted"]);
      resultSeries[3].data.push(picData.reportCountByStatus["InProcess"]);
    })

    setPICReportCountSeries(resultSeries);
    setPICReportCountNames(resultNames);
  }, [sortedPICData, page]);

  return <>
    <UsePICRankHookEffect />
  </>;
}

