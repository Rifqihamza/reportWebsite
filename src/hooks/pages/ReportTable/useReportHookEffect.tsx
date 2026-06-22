import { useEffect } from "react";
import UseReportDataHookEffect, { useReportDataHook } from "../../shared/useReportData";
import { maxReportDataPerPage, useReportFilterHook, useReportPaginationHook } from "./useReportHook";
import { table_rows } from "../../../types/variables";

export default function UseReportHookEffect() {
  const { currentPage, setCurrentPage, setMaxPage, setShowedReportData } = useReportPaginationHook();
  const { reportData } = useReportDataHook();
  const { selectedFilter, dateFilter, searchKeyword, filteredReports, setFilteredReports } = useReportFilterHook();

  useEffect(() => {
    const { filteredReports } = useReportFilterHook.getState();
    const newMaxPage = Math.ceil(filteredReports.length / maxReportDataPerPage);

    // Set new max page
    (setMaxPage(newMaxPage),
      // If the current page is higher than the new max page, set the current page to 0
      setCurrentPage(currentPage >= newMaxPage ? 0 : currentPage),
      // Update showed report data
      setShowedReportData(filteredReports.slice(currentPage * maxReportDataPerPage, (currentPage + 1) * maxReportDataPerPage)));
  }, [filteredReports, currentPage]);

  useEffect(() => {
    if (!reportData) {
      return;
    }

    // Filter Categories and Status
    let result_data = reportData.filter((value, index) => {
      if (selectedFilter.type.length > 0 && !selectedFilter.type.includes(value.type)) {
        return false;
      }

      if (selectedFilter.status.length > 0 && !selectedFilter.status.includes(value.status)) {
        return false;
      }

      if (selectedFilter.campus.length > 0 && !selectedFilter.campus.includes(value.campus)) {
        return false;
      }

      if (
        selectedFilter.location.length > 0 &&
        (!value.location_name || !selectedFilter.location.find((locationFilter) => locationFilter[0] == value.campus && locationFilter[1] == value.location_name))
      ) {
        return false;
      }

      return true;
    });

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
        const search_data = Object.values(table_rows)
          .map((key) => value[key])
          .join("+")
          .toLowerCase();
        return search_data.includes(searchKeyword.toLowerCase());
      });
    }

    // Update Filtered Reports
    setFilteredReports(result_data);
  }, [selectedFilter, reportData, dateFilter, searchKeyword]);

  return (
    <>
      <UseReportDataHookEffect />
    </>
  );
}
