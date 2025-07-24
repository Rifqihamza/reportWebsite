import { create } from "zustand";
import UseReportDataHookEffect, { useReportDataHook } from "../../shared/useReportData";
import { useEffect } from "react";

export enum PICFilterTimeSpan {
  Yearly = "Yearly",
  Monthly = "Monthly",
  Weekly = "Weekly",
  Daily = "Daily",
  AllTime = "All Time"
};

type usePICFilterType = {
  startDateFilter: Date;
  endDateFilter: Date;
  setStartDateFilter: (newStartDateFilter: Date) => void;
  setEndDateFilter: (newEndDateFilter: Date) => void;
  prevDate: () => void;
  nextDate: () => void;

  currentTimeSpan: PICFilterTimeSpan;
  setCurrentTimeSpan: (newCurrentTimeSpan: PICFilterTimeSpan) => void;
};

export const usePICFilterHook = create<usePICFilterType>((set) => ({
    startDateFilter: new Date(),
    endDateFilter: new Date(),
    setStartDateFilter: (newStartDateFilter) => set((state) => ({ startDateFilter: newStartDateFilter })),
    setEndDateFilter: (newEndDateFilter) => set((state) => {
      return { 
        endDateFilter: newEndDateFilter
      };
    }),

  prevDate: () => {
    set((state) => {
      let resultDate = new Date(state.endDateFilter);

      if(state.currentTimeSpan === PICFilterTimeSpan.Daily) {
        resultDate.setDate(resultDate.getDate() - 1);
      }
      else if(state.currentTimeSpan === PICFilterTimeSpan.Weekly) {
        resultDate.setDate(resultDate.getDate() - 7);
      }
      else if(state.currentTimeSpan === PICFilterTimeSpan.Monthly) {
        resultDate.setMonth(resultDate.getMonth() - 1);
      }
      else if(state.currentTimeSpan === PICFilterTimeSpan.Yearly) {
        resultDate.setFullYear(resultDate.getFullYear() - 1);
      }
      
      return {
        endDateFilter: resultDate
      };
    })
  },
  nextDate: () => {
    set((state) => {
      let resultDate = new Date(state.endDateFilter);

      if(state.currentTimeSpan === PICFilterTimeSpan.Daily) {
        resultDate.setDate(resultDate.getDate() + 1);
      }
      else if(state.currentTimeSpan === PICFilterTimeSpan.Weekly) {
        resultDate.setDate(resultDate.getDate() + 7);
      }
      else if(state.currentTimeSpan === PICFilterTimeSpan.Monthly) {
        resultDate.setMonth(resultDate.getMonth() + 1);
      }
      else if(state.currentTimeSpan === PICFilterTimeSpan.Yearly) {
        resultDate.setFullYear(resultDate.getFullYear() + 1);
      }

      return {
        endDateFilter: resultDate
      };
    })
  },

  currentTimeSpan: PICFilterTimeSpan.AllTime,
  setCurrentTimeSpan: (newCurrentTimeSpan) => set(() => ({ currentTimeSpan: newCurrentTimeSpan, endDateFilter: new Date() }))
}));

export default function UsePICFilterHookEffect() {
  const { reportData } = useReportDataHook();
  const { setStartDateFilter, endDateFilter, currentTimeSpan } = usePICFilterHook();
  
  useEffect(() => {
    let startDateFilter = new Date();
    if(currentTimeSpan === PICFilterTimeSpan.AllTime) {
      startDateFilter = reportData ? new Date(reportData[reportData.length - 1].created_at) : new Date();
    }
    else if(currentTimeSpan === PICFilterTimeSpan.Monthly) {
      startDateFilter.setMonth(endDateFilter.getMonth() - 1);
    }
    else if(currentTimeSpan === PICFilterTimeSpan.Yearly) {
      startDateFilter.setFullYear(endDateFilter.getFullYear() - 1);
    }
    else if(currentTimeSpan === PICFilterTimeSpan.Weekly) {
      startDateFilter.setDate(endDateFilter.getDate() - 7);
    }
    else {
      startDateFilter.setDate(endDateFilter.getDate() - 1);
    }

    setStartDateFilter(startDateFilter);
  }, [currentTimeSpan, endDateFilter, reportData]);
  
  return <><UseReportDataHookEffect /></>;
}