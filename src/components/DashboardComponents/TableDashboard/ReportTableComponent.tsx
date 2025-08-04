import ReportDesktopTable from "./Desktop/ReportDesktopTable";
import ReportDetailModal from "./Modals/ReportDetailModal";
import ReportPagination from "./Toolbar/ReportPagination";
import ReportEditModal from "./Modals/ReportEditModal";
import ReportMobileTable from "./Mobile/ReportMobileTable";


import { ReportHookEffect } from "../../../hooks/pages/ReportTable/useReportHook";
import ReportCompletionModal from "./Modals/ReportCompletionModal";
import ReportEvidenceModal from "./Modals/ReportEvidenceModal";


export default function ReportListComponent() {
  return (
    <>
      {/* Reload Report Data */}
      <ReportHookEffect />

    
      {/* Desktop Table View */}
      <ReportDesktopTable />

      {/* Mobile Card View */}
      <ReportMobileTable />

      {/* Detail Modal */}
      <ReportDetailModal />

      {/* Edit Dialog */}
      <ReportEditModal />

      {/* Pagination Controls */}
      <ReportPagination />

      {/* Completition Dialog */}
      <ReportCompletionModal />

      {/* Evidence Dialog */}
      <ReportEvidenceModal />
    </>
  );
};