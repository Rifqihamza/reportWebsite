import { useState, useEffect, useRef } from "react";
import { APIResultType, deleteReport } from "../utils/api_interface";
import { AccountType, ReportStatus, ReportType, string_to_reportstatus, reporttype_to_string, type ReportData } from '../types/variables';
import type { Toast } from 'primereact/toast';
import type { ToastMessage } from 'primereact/toast';

// Utility for formatting dates
export const useFormatDate = () => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);

        // Format date part
        const formattedDate = date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        // Format time part without "pukul"
        const formattedTime = date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        return `${formattedDate} ${formattedTime}`;
    };

    return { formatDate };
};

// Hook for filtering report data
export const useReportFilters = (
    reportData: ReportData[],
    selectedFilter: null | ReportType | ReportStatus,
    dateFilter: (Date | null)[],
    searchKeyword: string
) => {
    const [filteredReports, setFilteredReports] = useState<ReportData[]>([]);

    useEffect(() => {
        // Filter Categories and Status
        let result_data = reportData.filter((value) =>
            selectedFilter ?
                (string_to_reportstatus(selectedFilter) ? value.status == selectedFilter : value.type == selectedFilter)
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
                const search_data = (value.submitted_by + ":" + value.pic_name + ":" + value.message + ":" + value.location).toLowerCase();
                return search_data.includes(searchKeyword.toLowerCase());
            });
        }

        setFilteredReports(result_data);
    }, [selectedFilter, reportData, dateFilter, searchKeyword]);

    return filteredReports;
};

// Hook for pagination
export const usePagination = (items: any[], itemsPerPage: number) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);

    useEffect(() => {
        const newMaxPage = Math.ceil(items.length / itemsPerPage);
        setMaxPage(newMaxPage);
        if (currentPage >= newMaxPage) {
            setCurrentPage(0);
        }
    }, [items, itemsPerPage, currentPage]);

    const currentItems = items.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return {
        currentPage,
        setCurrentPage,
        maxPage,
        currentItems
    };
};

// Hook for detail modal
export const useReportDetail = (reportData: ReportData[]) => {
    const [detailId, setDetailId] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<ReportStatus | string | null>(null);
    const [isChange, setIsChange] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);

    const selectedReport = reportData.find(report => report.id === detailId) || null;

    const handleDetail = (id: string) => {
        const report = reportData.find(report => report.id === id);
        setDetailId(id);
        setIsChange(true);
        setSelectedStatus(report?.status ?? null);
    };

    const handleClose = () => {
        setDetailId(null);
    };

    useEffect(() => {
        setIsChange(selectedStatus != reportData.find((data) => data.id === detailId)?.status);
    }, [selectedStatus, detailId, reportData]);

    return {
        detailId,
        setDetailId,
        selectedStatus,
        setSelectedStatus,
        isChange,
        dialogVisible,
        setDialogVisible,
        selectedReport,
        handleDetail,
        handleClose
    };
};

// Hook for report deletion
export const useReportDeletion = (
    reportData: ReportData[],
    setReportData: React.Dispatch<React.SetStateAction<ReportData[]>>,
    toastRef: React.RefObject<Toast>
) => {
    const [deleteDisabled, setDeleteDisabled] = useState(false);

    const showMessage = (
        label: string,
        ref: React.RefObject<Toast | null>,
        severity: ToastMessage['severity'],
        detail: string
    ) => {
        ref.current?.show({ severity: severity, summary: label, detail: detail, life: 3000 });
    };

    const handleDelete = async (id: string, userData: any) => {
        if (!userData || userData.role == AccountType.Siswa || !confirm("Are you sure?")) {
            return;
        }
        setDeleteDisabled(true);

        if (reportData.find((data) => data.id == id)?.status === ReportStatus.InProcess) {
            alert("Tidak bisa menghapus laporan yang sudah di follow up");
            setDeleteDisabled(false);
            return;
        }

        const result = await deleteReport(id);

        if (result == APIResultType.NoError) {
            setReportData(reportData.filter((value) => value.id != id));
            showMessage("Success", toastRef, 'success', "Data berhasil dihapus!");
            setDeleteDisabled(false);
            return true;
        }
        else if (result == APIResultType.InternalServerError) {
            showMessage("Error", toastRef, 'error', "Terjadi error di server!");
        }
        else if (result == APIResultType.Unauthorized) {
            showMessage("Unauthroized!", toastRef, 'error', "Akses tidak dikenal!");
        }

        setDeleteDisabled(false);
        return false;
    };

    return {
        deleteDisabled,
        handleDelete,
        showMessage
    };
};

// Utility constants
export const statusColors = {
    NotStarted: "bg-red-100 text-red-800",
    InProcess: "bg-yellow-100 text-yellow-800",
    Complete: "bg-green-100 text-green-800",
    Hold: "bg-blue-100 text-blue-800",
};