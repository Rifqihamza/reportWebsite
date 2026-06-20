import { create } from "zustand";
import { Campus } from "../../../types/variables";

type UseLocationHookType = {
  selectedCampus: Campus,
  setSelectedCampus: (newValue: Campus) => void;
};

export const useFormSidebarHooks = create<UseLocationHookType>((set) => ({
  selectedCampus: Campus.MM,
  setSelectedCampus(newValue) {
    set(() => ({
      selectedCampus: newValue
    }));
  },
}));