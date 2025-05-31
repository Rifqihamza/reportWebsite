import ReportDesktopTable from "./ReportDesktopTable";
import ReportDetailModal from "./ReportDetailModal";
import ReportPagination from "./ReportPagination";
import ReportEditModal from "./ReportEditModal";
import ReportMobileTable from "./ReportMobileTable";


export default function ReportListComponent() {
  return (
    <>
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
    </>
  );
};
