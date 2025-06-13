import { create } from "zustand";

type useDashboardNavbarType = {
  activeTab: number;
  setActiveTab: (newActiveTab: number) => void;
  showSidebar: boolean
  setShowSidebar: (newShowSidebar: boolean) => void
};

export const useDashboardNavbarHook = create<useDashboardNavbarType>((set) => {
  return {
    activeTab: 0,
    setActiveTab(newActiveTab) {
      set(() => ({ activeTab: newActiveTab }));
    },

    showSidebar: false,
    setShowSidebar(newShowSidebar) {
      set(() => ({ showSidebar: newShowSidebar }));
    },
  }
})
