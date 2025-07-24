import { create } from "zustand";

export enum PICFilterTimeSpan {
  Yearly = "Yearly",
  Monthly = "Monthly",
  Weekly = "Weekly",
  Daily = "Daily",
  AllTime = "All Time"
};

type usePICFilterType = {
  endDateFilter: Date;
  setEndDateFilter: (newEndDateFilter: Date) => void;
  prevDate: () => void;
  nextDate: () => void;

  currentTimeSpan: PICFilterTimeSpan;
  setCurrentTimeSpan: (newCurrentTimeSpan: PICFilterTimeSpan) => void;
};

export const usePICFilterHook = create<usePICFilterType>((set) => ({
  endDateFilter: new Date(),
  setEndDateFilter: (newEndDateFilter) => set(() => ({ endDateFilter: newEndDateFilter })),

  prevDate: () => {
    set((state) => {
      let resultDate = state.endDateFilter;

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
      let resultDate = state.endDateFilter;

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
  return <></>;
}