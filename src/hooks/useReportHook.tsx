import { create } from "zustand";
import {
  AccountType,
  ReportStatus,
  ReportType,
  string_to_reportstatus,
  type ReportData,
} from "../types/variables";
import UseReportDataHookEffect, { useReportDataHook } from "./shared/useReportData";
import { useUserDataHook } from "./shared/useUserData";
import { APIResultType, deleteReport } from "../utils/api_interface";
import { useMessageToastHook } from "./shared/useMessageToast";
import { useEffect } from "react";
import { useNetworkConnectivityHook } from "./shared/useNetworkConnectivity";

const maxReportDataPerPage: number = 10;

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
      if(!isConnected) return;
      
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
  selectedFilter: null | ReportType | ReportStatus;
  setSelectedFilter: (newSelectedFilter: null | ReportType | ReportStatus) => void;

  dateFilter: (Date | null)[];
  setDateFilter: (newDateFilter: (Date | null)[]) => void;

  searchKeyword: string;
  setSearchKeyword: (newSearchKeyword: string) => void;

  filteredReports: ReportData[];
  setFilteredReports: (newFilteredReports: ReportData[]) => void;
};

export const useReportFilterHook = create<useReportFilterType>((set) => {
  return {
    selectedFilter: null,
    setSelectedFilter(newSelectedFilter) {
      set(() => ({ selectedFilter: newSelectedFilter }));
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




// -- REACT GLOBAL USE EFFECT COMPONENT
export function ReportHookEffect() {
  const { currentPage, setCurrentPage, setMaxPage, setShowedReportData } =
    useReportPaginationHook();
  const { reportData } = useReportDataHook();
  const { selectedFilter, dateFilter, searchKeyword, filteredReports, setFilteredReports } =
    useReportFilterHook();

  useEffect(() => {
    const { filteredReports } = useReportFilterHook.getState();
    const newMaxPage = Math.ceil(filteredReports.length / maxReportDataPerPage);

    // Set new max page
    setMaxPage(newMaxPage),
      // If the current page is higher than the new max page, set the current page to 0
      setCurrentPage(currentPage >= newMaxPage ? 0 : currentPage),
      // Update showed report data
      setShowedReportData(
        filteredReports.slice(
          currentPage * maxReportDataPerPage,
          (currentPage + 1) * maxReportDataPerPage
        )
      );
  }, [filteredReports, currentPage]);

  useEffect(() => {
    if(!reportData) {
      return;
    }
    
    // Filter Categories and Status
    let result_data = reportData.filter((value) =>
      selectedFilter
        ? string_to_reportstatus(selectedFilter)
          ? value.status == selectedFilter
          : value.type == selectedFilter
        : true
    );

    // Filter Date
    if (dateFilter && (dateFilter[0] || dateFilter[1])) {
      const max = dateFilter[1] ? dateFilter[1].getTime() + 1000 * 60 * 60 * 24 : null;
      const min = dateFilter[0] ? dateFilter[0].getTime() : null;
      result_data = result_data.filter((value) => {
        const current = new Date(value.created_at).getTime();
        return (max ? current <= max : true) && (min ? current >= min : true);
      });
    }

    // Filter Keyword
    if (searchKeyword) {
      result_data = result_data.filter((value) => {
        const search_data = (
          value.submitted_by +
          ":" +
          value.pic_name +
          ":" +
          value.message +
          ":" +
          value.location_name +
          ":" + 
          (value.campus ?? "").toString()
        ).toLowerCase();
        return search_data.includes(searchKeyword.toLowerCase());
      });
    }

    // Update Filtered Reports
    setFilteredReports(result_data);
  }, [selectedFilter, reportData, dateFilter, searchKeyword]);

  return <>
    <UseReportDataHookEffect />
  </>;
}

// Utility constants
export const statusColors = {
  NotStarted: "bg-red-100 text-red-800",
  InProcess: "bg-yellow-100 text-yellow-800",
  Complete: "bg-green-100 text-green-800",
  Hold: "bg-blue-100 text-blue-800",
};