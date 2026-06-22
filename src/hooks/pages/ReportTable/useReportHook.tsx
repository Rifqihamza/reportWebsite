import { create } from "zustand";
import { AccountType, Campus, ReportStatus, ReportType, type ReportData } from "../../../types/variables";
import { useReportDataHook } from "../../shared/useReportData";
import { useUserDataHook } from "../../shared/useUserData";
import { APIResultType, deleteReport } from "../../../utils/api_interface";
import { useMessageToastHook } from "../../shared/useMessageToast";
import { useNetworkConnectivityHook } from "../../shared/useNetworkConnectivity";

export const maxReportDataPerPage: number = 7;

type SelectedFilterType = {
  type: ReportType[];
  status: ReportStatus[];
  campus: Campus[];
  location: [Campus, string][];
};

// --/ Report Detail Hook
type useReportDetailHookType = {
  detailId: string | null;
  setDetailId: (newDetailId: string) => void;
  handleDetail: (id: string) => void;

  isChange: boolean;
  setIsChange: (newIsChange: boolean) => void;

  handleClose: () => void;

  deleteDisabled: boolean;
  setDeleteDisabled: (newDeleteDisabled: boolean) => void;
  handleDelete: (id: string) => Promise<boolean | undefined>;

  currentTypeFilter: ReportType[];
  setCurrentTypeFilter: (newValue: ReportType[]) => void;

  currentStatusFilter: ReportStatus[];
  setCurrentStatusFilter: (newValue: ReportStatus[]) => void;

  currentCampusFilter: Campus[];
  setCurrentCampusFilter: (newValue: Campus[]) => void;

  currentLocationFilter: [Campus, string][];
  setCurrentLocationFilter: (newValue: [Campus, string][]) => void;
};

export const useReportDetailHook = create<useReportDetailHookType>((set, get) => {
  return {
    // -- Detail ID
    detailId: null,
    setDetailId: (newDetailId) => {
      set(() => ({ detailId: newDetailId }));
    },

    // -- Handing close report detail
    handleClose() {
      set(() => ({ detailId: null }));
    },

    // -- Check if there's changes in
    isChange: false,
    setIsChange: (newIsChange: boolean) => {
      set(() => ({ isChange: newIsChange }));
    },
    // -- Delete Button Disabled
    deleteDisabled: false,
    setDeleteDisabled: (newDeleteDisabled) => {
      set(() => ({ deleteDisabled: newDeleteDisabled }));
    },

    // -- Handling report deletion
    handleDelete: async (id: string) => {
      const { isConnected } = useNetworkConnectivityHook.getState();
      if (!isConnected) return;

      const { reportData, setReportData } = useReportDataHook.getState();
      const { userData } = useUserDataHook.getState();
      const { showMessage } = useMessageToastHook.getState();

      // Check if the user is
      if (!userData || userData.role == AccountType.Siswa || !confirm("Are you sure?")) {
        return;
      }

      // Disable delete button
      set(() => ({ deleteDisabled: true }));

      if (reportData?.find((data) => data.id == id)?.status === ReportStatus.InProcess) {
        alert("Tidak bisa menghapus laporan yang sudah di follow up");
        set(() => ({ deleteDisabled: false }));
        return;
      }

      const result = await deleteReport(id);

      if (result == APIResultType.NoError) {
        setReportData(reportData?.filter((value) => value.id != id) || null);
        showMessage("Success", "success", "Data berhasil dihapus!");

        set(() => ({ deleteDisabled: false, detailId: null }));
        return true;
      } else if (result == APIResultType.InternalServerError) {
        showMessage("Error", "error", "Terjadi error di server!");
      } else if (result == APIResultType.Unauthorized) {
        showMessage("Unauthroized!", "error", "Akses tidak dikenal!");
      }

      set(() => ({ deleteDisabled: false }));
      return false;
    },

    // -- Handling open report detail
    handleDetail(id) {
      const { setDetailId, setIsChange } = useReportDetailHook.getState();
      setDetailId(id);
      setIsChange(true);
    },

    currentTypeFilter: [],
    setCurrentTypeFilter(newValue) {
      set(() => ({
        currentTypeFilter: newValue,
      }));
    },

    currentStatusFilter: [],
    setCurrentStatusFilter(newValue) {
      set(() => ({
        currentStatusFilter: newValue,
      }));
    },

    currentCampusFilter: [],
    setCurrentCampusFilter(newValue) {
      set(() => ({
        currentCampusFilter: newValue,
      }));
    },

    currentLocationFilter: [],
    setCurrentLocationFilter(newValue) {
      set(() => ({
        currentLocationFilter: newValue,
      }));
    },
  };
});

// --/ Report Pagination Hook
type useReportPaginationType = {
  currentPage: number;
  setCurrentPage: (newCurrentPage: number) => void;

  maxPage: number;
  setMaxPage: (newMaxPage: number) => void;

  showedReportData: ReportData[];
  setShowedReportData: (newShowedReportData: ReportData[]) => void;
};

export const useReportPaginationHook = create<useReportPaginationType>((set, get) => {
  return {
    currentPage: 0,
    setCurrentPage(newCurrentPage) {
      set(() => ({ currentPage: newCurrentPage }));
    },

    maxPage: 0,
    setMaxPage(newMaxPage) {
      set(() => ({ maxPage: newMaxPage }));
    },

    showedReportData: [],
    setShowedReportData(newShowedReportData) {
      set(() => ({ showedReportData: newShowedReportData }));
    },
  };
});

// --/ Report Edit Hook
type useReportEditType = {
  editVisible: boolean;
  setEditVisible: (newEditVisible: boolean) => void;
};

export const useReportEditHook = create<useReportEditType>((set) => {
  return {
    editVisible: false,
    setEditVisible(newEditVisible) {
      set(() => ({ editVisible: newEditVisible }));
    },
  };
});

// --/ Report Filter Hook
type useReportFilterType = {
  selectedFilter: SelectedFilterType;
  setSelectedFilter: (newSelectedFilter: SelectedFilterType) => void;
  setReportTypeFilter: (newReportTypeFilter: ReportType[]) => void;
  setReportStatusFilter: (newReportStatusFilter: ReportStatus[]) => void;
  setCampusFilter: (newCampusFilter: Campus[]) => void;
  resetFilter: () => void;

  dateFilter: (Date | null)[];
  setDateFilter: (newDateFilter: (Date | null)[]) => void;

  searchKeyword: string;
  setSearchKeyword: (newSearchKeyword: string) => void;

  filteredReports: ReportData[];
  setFilteredReports: (newFilteredReports: ReportData[]) => void;
};

export const useReportFilterHook = create<useReportFilterType>((set) => {
  return {
    selectedFilter: { campus: [], status: [], type: [], location: [] },
    setSelectedFilter(newSelectedFilter) {
      set(() => ({ selectedFilter: newSelectedFilter }));
    },
    setReportTypeFilter(newReportTypeFilter) {
      set((state) => {
        const currentSelectedFilter = state.selectedFilter;
        currentSelectedFilter.type = newReportTypeFilter;

        return {
          selectedFilter: currentSelectedFilter,
        };
      });
    },
    setReportStatusFilter(newReportStatusFilter) {
      set((state) => {
        const currentSelectedFilter = state.selectedFilter;
        currentSelectedFilter.status = newReportStatusFilter;

        return {
          selectedFilter: currentSelectedFilter,
        };
      });
    },
    setCampusFilter(newCampusFilter) {
      set((state) => {
        const currentSelectedFilter = state.selectedFilter;
        currentSelectedFilter.campus = newCampusFilter;

        return {
          selectedFilter: currentSelectedFilter,
        };
      });
    },
    resetFilter() {
      set(() => ({ selectedFilter: { campus: [], status: [], type: [], location: [] } }));
    },

    dateFilter: [],
    setDateFilter(newDateFilter) {
      set(() => ({ dateFilter: newDateFilter }));
    },

    searchKeyword: "",
    setSearchKeyword(newSearchKeyword) {
      set(() => ({ searchKeyword: newSearchKeyword }));
    },

    filteredReports: [],
    setFilteredReports(newFilteredReports) {
      set(() => ({ filteredReports: newFilteredReports }));
    },
  };
});

// Utility constants
export const statusColors = {
  NotStarted: "bg-red-300 text-red-800",
  InProcess: "bg-yellow-300 text-yellow-800",
  Complete: "bg-green-300 text-green-800",
  Hold: "bg-blue-300 text-blue-800",
};
