import { create } from "zustand";
import { useReportDataHook } from "../../shared/useReportData";
import { useEffect } from "react";
import UsePICRankHookEffect, { usePICRankHook } from "./usePICRankHook";

type usePICReportCountType = {
  picReportCountSeries: ApexAxisChartSeries;
  setPICReportCountSeries: (newPICReportCountSeries: ApexAxisChartSeries) => void;

  picReportCountNames: string[];
  setPICReportCountNames: (newPICReportCountNames: string[]) => void;
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
  };
});


export default function UsePICReportCountHookEffect() {
  const { showedPICData } = usePICRankHook();
  const { setPICReportCountSeries, setPICReportCountNames } = usePICReportCountHook();

  useEffect(() => {
    if(!showedPICData) return;

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

    Object.entries(showedPICData).forEach(([name, picData], index) => {
      resultNames.push(name);
      resultSeries[0].data.push(picData.reportCountByStatus["Complete"]);
      resultSeries[1].data.push(picData.reportCountByStatus["Hold"]);
      resultSeries[2].data.push(picData.reportCountByStatus["NotStarted"]);
      resultSeries[3].data.push(picData.reportCountByStatus["InProcess"]);
    })

    setPICReportCountSeries(resultSeries);
    setPICReportCountNames(resultNames);
  }, [showedPICData]);

  return <>
    <UsePICRankHookEffect />
  </>;
}

