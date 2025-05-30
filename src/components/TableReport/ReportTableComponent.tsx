import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { type ReportData, type ReportType, type ReportStatus } from "../../types/variables";
import {
  useReportFilters,
  usePagination,
  useReportDetail,
  useReportDeletion,
} from "../../hooks/useReportHooks";

import ReportDesktopTable from "./ReportDesktopTable";
import ReportMobileCard from "./ReportMobileCard";
import ReportDetailModal from "./ReportDetailModal";
import ReportPagination from "./ReportPagination";
import DialogComponent from "../DialogPopUp/DialogComponent";
import { useUserData } from "../../hooks/useUserData";
import { useReportData } from "../../hooks/useReportData";

const reportsPerPage = 7;

interface ReportListComponentProps {
  selectedFilter: ReportType | ReportStatus | null;
  dateFilter: (Date | null)[];
  searchKeyword: string;
}

const ReportListComponent: React.FC<ReportListComponentProps> = ({
  selectedFilter,
  dateFilter,
  searchKeyword,
}) => {
  const { reportData } = useReportData();
  const { userData } = useUserData();
    
  const toastTopRight = useRef<Toast>(null) as React.RefObject<Toast>;
  const [saveDisabled, setSaveDisabled] = useState(false);

  const filteredReports = useReportFilters(reportData, selectedFilter, dateFilter, searchKeyword);

  const {
    currentPage,
    setCurrentPage,
    maxPage,
    currentItems: displayedReports,
  } = usePagination(filteredReports, reportsPerPage);

  const {
    detailId,
    setDetailId,
    dialogVisible,
    setDialogVisible,
    handleDetail,
    handleClose,
  } = useReportDetail(reportData);

  const { deleteDisabled, handleDelete, showMessage } = useReportDeletion(
    toastTopRight
  );

  return (
    <>
      {/* Desktop Table View */}
      <ReportDesktopTable reports={displayedReports} onDetailClick={handleDetail} />

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredReports.length === 0 ? (
          <h1 className="opacity-75">Tidak ada laporan..</h1>
        ) : (
          displayedReports.map((report) => (
            <ReportMobileCard key={report.id} report={report} onDetail={handleDetail} />
          ))
        )}
      </div>

      {/* Detail Modal */}
      <ReportDetailModal
        detailId={detailId}
        onClose={handleClose}
        onDelete={(id) => {
          handleDelete(id, userData).then((success) => {
            if (success) setDetailId(null);
          });
        }}
        onEdit={() => setDialogVisible(true)}
        deleteDisabled={deleteDisabled}
        saveDisabled={saveDisabled}
      />

      {/* Edit Dialog */}
      <DialogComponent
        detailId={detailId}
        visible={dialogVisible}
        setVisible={setDialogVisible}
        onSuccess={() => showMessage("Success", toastTopRight, "success", "Successfully update data!")}
        onUnauthorized={() => showMessage("Unauthorized", toastTopRight, "error", "Unauthorized attempt detected!")}
        onError={() => showMessage("Error", toastTopRight, "error", "There's an error!")}
      />

      <Toast ref={toastTopRight} position="top-right" />

      {/* Pagination Controls */}
      <ReportPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        maxPage={maxPage}
        onPageChange={(page: number) => setCurrentPage(page)}
      />
    </>
  );
};

export default ReportListComponent;
