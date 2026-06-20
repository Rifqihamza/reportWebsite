import { create } from "zustand";

type useDashboardSidebarType = {
  activeTab: number;
  setActiveTab: (newActiveTab: number) => void;

  showSidebar: boolean;
  setShowSidebar: (newShowSidebar: boolean) => void;
};

export const useDashboardSidebarHook = create<useDashboardSidebarType>((set) => {
  return {
    activeTab: 7,
    setActiveTab(newActiveTab) {
      set(() => ({ activeTab: newActiveTab }));
    },

    showSidebar: false,
    setShowSidebar(newShowSidebar) {
      set(() => ({ showSidebar: newShowSidebar }));
    },
  };
});
