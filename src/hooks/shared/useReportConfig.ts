import { create } from "zustand";

type useReportConfigType = {
  picNamesOptions: string[];
  setPicNamesOptions: (newPicNamesOptions: string[]) => void;

  locationOptions: string[];
  setLocationOptions: (newLocationOptions: string[]) => void;
};

export const useReportConfigHook = create<useReportConfigType>((set) => {
  return {
    // PIC names options
    picNamesOptions: [],
    setPicNamesOptions(newPicNamesOptions) {
      set(() => ({ picNamesOptions: newPicNamesOptions }));
    },

    // Location options
    locationOptions: [],
    setLocationOptions(newLocationOptions) {
      set(() => ({ locationOptions: newLocationOptions }));
    },
  };
});
