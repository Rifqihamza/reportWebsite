import { create } from "zustand";
import { Campus, ReportStatus, ReportType, reporttype_to_string, string_to_reporttype } from "../../../types/variables";
import { useReportDataHook } from "../../shared/useReportData";
import { useEffect } from "react";
import strftime from "strftime";
import { useReportConfigHook } from "../../shared/useReportConfig";

export enum LineChartTimeCategoryOption {
  Year = "Tahun ini",
  Month = "Bulan ini",
  Week = "Minggu ini",
  Today = "Hari ini",
}

type CategoryType = {
  labels: string;
  value: number;
};

type LineChartValueType = {
  labels: string;
  type: ReportType | string;
  value: number;
};

type InsightDataType = {
  totalReportAllTime: number;
  totalReportLastMonth: number;
  totalReportThisMonth: number;
  totalReportPerCategory: {
    [key in ReportType]?: number;
  };
  totalReportPerStatus: {
    [key in ReportStatus]?: number;
  };
  totalReportPerDay: {
    [key: string]: number;
  };
  totalReportPerPIC: {
    [key: string]: number;
  };
  betterThanLastMonth: boolean | null;
  highestOccuranceCategory: ReportType | null;
  highestOccuranceDay: string;
  notCompletedReportPreviousMonth: number;
};

// -- Pie Chart States
type UsePieChartype = {
  pieCategory: CategoryType[];
  setPieCategory: (newPieCategory: CategoryType[]) => void;

  pieStatus: CategoryType[];
  setPieStatus: (newPieStatus: CategoryType[]) => void;

  percentStatus: CategoryType[];
  setPercentStatus: (newPercentStatus: CategoryType[]) => void;

  lineChartCategoryFilter: ReportType | null;
  setLineChartCategoryFilter: (newChartCategoryFilter: ReportType | null) => void;
};

export const usePieChartHook = create<UsePieChartype>((set) => {
  return {
    lineChartCategoryFilter: null,
    setLineChartCategoryFilter: (newChartCategoryFilter) => {
      set(() => ({ lineChartCategoryFilter: newChartCategoryFilter }));
    },

    percentStatus: [],
    setPercentStatus: (newPercentStatus) => {
      set(() => ({ percentStatus: newPercentStatus }));
    },

    pieCategory: [],
    setPieCategory: (newPieCategory) => {
      set(() => ({ pieCategory: newPieCategory }));
    },

    pieStatus: [],
    setPieStatus: (newPieStatus) => {
      set(() => ({ pieStatus: newPieStatus }));
    },
  };
});

// -- Line Chart States
type UseLineChartType = {
  lineChartFilteredReports: LineChartValueType[];
  setLineChartFilteredReports: (newCurrentYearReports: LineChartValueType[]) => void;

  chartTimeFilter: LineChartTimeCategoryOption;
  appliedChartTimeFilter: LineChartTimeCategoryOption;
  setChartTimeCategoryFilter: (newChartFilter: LineChartTimeCategoryOption) => void;

  chartCampusFilter: Campus[];
  appliedChartCampusFilter: Campus[];
  toggleChartCampusFilter: (selectedCampus: Campus) => void;

  chartLocationFilter: [Campus, string][];
  appliedChartLocationFilter: [Campus, string][];
  setChartLocationFilter: (locationList: [Campus, string][]) => void;

  applyFilter: () => void;
};

export const useLineChartHook = create<UseLineChartType>((set) => {
  return {
    lineChartFilteredReports: [],
    setLineChartFilteredReports(newCurrentYearReports) {
      set(() => ({ lineChartFilteredReports: newCurrentYearReports }));
    },

    chartTimeFilter: LineChartTimeCategoryOption.Year,
    appliedChartTimeFilter: LineChartTimeCategoryOption.Year,
    setChartTimeCategoryFilter(newChartFilter) {
      set(() => ({ chartTimeFilter: newChartFilter }));
    },

    chartCampusFilter: [],
    appliedChartCampusFilter: [],
    toggleChartCampusFilter(selectedCampus) {
      set((state) => {
        return {
          chartCampusFilter: state.chartCampusFilter.includes(selectedCampus) ? state.chartCampusFilter.filter((value) => value !== selectedCampus) : [...state.chartCampusFilter, selectedCampus],
        };
      });
    },

    chartLocationFilter: [],
    appliedChartLocationFilter: [],
    setChartLocationFilter(locationList) {
      set(() => ({ chartLocationFilter: locationList }));
    },

    applyFilter() {
      set((state) => ({
        appliedChartCampusFilter: state.chartCampusFilter, 
        appliedChartLocationFilter: state.chartLocationFilter, 
        appliedChartTimeFilter: state.chartTimeFilter
      }))
    },
  };
});

// -- Percent Chart States
type UsePercentChartType = {
  percentCategory: CategoryType[];
  setPercentCategory: (newPercentCategory: CategoryType[]) => void;
};

export const usePercentChartHook = create<UsePercentChartType>((set) => {
  return {
    percentCategory: [],
    setPercentCategory(newPercentCategory) {
      set(() => ({ percentCategory: newPercentCategory }));
    },
  };
});

// -- Insight States
type UseInsightType = {
  insight: InsightDataType | null;
  setInsight: (newInsight: InsightDataType | null) => void;
};

export const useInsightHook = create<UseInsightType>((set) => {
  return {
    insight: null,
    setInsight: (newInsight) => {
      set(() => ({ insight: newInsight }));
    },
  };
});

// -- REACT GLOBAL USE EFFECT COMPONENT
export const listOfMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];
const listOfNumOfDates = [31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30];
const listOfHari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
export const listOfDay = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function UseChartHookEffect() {
  const { chunkedReportData: reportData } = useReportDataHook();
  const { lineChartCategoryFilter: chartCategoryFilter, setPercentStatus, setPieCategory, setPieStatus } = usePieChartHook();
  const { setInsight } = useInsightHook();
  const { appliedChartTimeFilter, setLineChartFilteredReports, lineChartFilteredReports, appliedChartCampusFilter, appliedChartLocationFilter } = useLineChartHook();
  const { setPercentCategory } = usePercentChartHook();
  const { picNamesOptions } = useReportConfigHook();

  useEffect(() => {
    if (!reportData) {
      return;
    }

    const result: InsightDataType = {
      totalReportAllTime: reportData.length,
      totalReportLastMonth: 0,
      totalReportThisMonth: 0,
      totalReportPerCategory: {},
      totalReportPerStatus: {},
      totalReportPerDay: {},
      totalReportPerPIC: {},
      betterThanLastMonth: null,
      highestOccuranceCategory: null,
      highestOccuranceDay: "",
      notCompletedReportPreviousMonth: 0,
    };

    // Preparing for the result
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    Object.values(ReportType).forEach((type) => {
      result.totalReportPerCategory[type] = 0;
    });

    Object.values(ReportStatus).forEach((status) => {
      result.totalReportPerStatus[status] = 0;
    });

    listOfHari.forEach((day) => {
      result.totalReportPerDay[day] = 0;
    });

    // Insert all of the PIC to the data first
    Object.values(picNamesOptions).forEach((picNames) => {
      picNames.forEach((picName) => {
        result.totalReportPerPIC[picName] = 0;
      });
    });

    // Calculate the result
    reportData.forEach((data) => {
      const report_date = new Date(data.created_at);

      // Report happened today
      if (report_date.getMonth() == currentMonth && report_date.getFullYear() == currentYear) {
        result.totalReportThisMonth += 1;
      }

      if ((currentMonth > 1 && report_date.getMonth() == currentMonth - 1) || (currentMonth <= 1 && report_date.getFullYear() == currentYear - 1 && report_date.getDate() == 12)) {
        result.totalReportLastMonth += 1;
      }

      if (data.status != ReportStatus.Complete && (report_date.getMonth() < currentMonth || report_date.getFullYear() < currentYear)) {
        result.notCompletedReportPreviousMonth += 1;
      }

      if (data.pic_name) result.totalReportPerPIC[data.pic_name] += 1;
      result.totalReportPerCategory[data.type]! += 1;
      result.totalReportPerStatus[data.status]! += 1;
      result.totalReportPerDay[listOfHari[new Date(data.created_at).getDay() - 1]] += 1;
    });

    result.betterThanLastMonth = result.totalReportThisMonth < result.totalReportLastMonth;
    result.highestOccuranceCategory =
      string_to_reporttype(
        Object.entries(result.totalReportPerCategory).sort((category_a, category_b) => {
          return category_b[1] - category_a[1];
        })[0][0]
      ) ?? null;
    result.highestOccuranceDay = Object.entries(result.totalReportPerDay).sort((day_a, day_b) => {
      return day_b[1] - day_a[1];
    })[0][0];

    setInsight(result);
  }, [reportData]);

  useEffect(() => {
    // If there's no report data
    if (!reportData) {
      return;
    }

    // Prepare for Line Chart filter
    const result: LineChartValueType[] = [];
    const currentDate = new Date();
    const showedReportType = chartCategoryFilter ? [chartCategoryFilter] : Object.values(ReportType);

    // Prepare specifically for Date Filter in Line Chart
    if (appliedChartTimeFilter === LineChartTimeCategoryOption.Year) {
      listOfMonths.forEach((month) => {
        showedReportType.forEach((type) => {
          result.push({
            labels: month,
            type: reporttype_to_string(type),
            value: 0,
          });
        });
      });
    } else if (appliedChartTimeFilter === LineChartTimeCategoryOption.Month) {
      for (let i = 1; i <= listOfNumOfDates[currentDate.getMonth()]; i++) {
        showedReportType.forEach((type) => {
          result.push({
            labels: i.toString(),
            type: reporttype_to_string(type),
            value: 0,
          });
        });
      }
    } else if (appliedChartTimeFilter === LineChartTimeCategoryOption.Week) {
      listOfDay.forEach((day) => {
        showedReportType.forEach((type) => {
          result.push({
            labels: day,
            type: reporttype_to_string(type),
            value: 0,
          });
        });
      });
    } else if (appliedChartTimeFilter === LineChartTimeCategoryOption.Today) {
      for (let hour = 0; hour < 24; hour++) {
        showedReportType.forEach((type) => {
          result.push({
            labels: hour.toString(),
            type: reporttype_to_string(type),
            value: 0,
          });
        });
      }
    }

    // Start to filter report data
    const filtered = reportData.filter((value) => {
      // Category Filter
      if (chartCategoryFilter && value.type !== chartCategoryFilter) {
        return false;
      }

      // Campus Filter
      if (appliedChartCampusFilter.length > 0 && (!value.campus || !appliedChartCampusFilter.includes(value.campus))) {
        return false;
      }

      // Location Filter
      if (appliedChartLocationFilter.length > 0 && (!value.location_name || !appliedChartLocationFilter.find(([campus, location]) => value.location_name === location && value.campus === campus))) {
        return false;
      }

      // Date Filter
      const reportDate = new Date(value.created_at);
      let format = "";

      if (appliedChartTimeFilter === LineChartTimeCategoryOption.Today) format = "%d%m";
      else if (appliedChartTimeFilter === LineChartTimeCategoryOption.Month) format = "%m";
      else if (appliedChartTimeFilter === LineChartTimeCategoryOption.Week) format = "%W";

      format += "%y";

      if (strftime(format, reportDate) !== strftime(format, currentDate)) {
        return false;
      }

      // Pass all of the filter
      return true;
    });

    filtered.forEach((data) => {
      const date = new Date(data.created_at);
      let label = "";

      if (appliedChartTimeFilter === LineChartTimeCategoryOption.Year) label = listOfMonths[date.getMonth()];
      else if (appliedChartTimeFilter === LineChartTimeCategoryOption.Month) label = date.getDate().toString();
      else if (appliedChartTimeFilter === LineChartTimeCategoryOption.Week) label = strftime("%a", date);
      else if (appliedChartTimeFilter === LineChartTimeCategoryOption.Today) label = strftime("%k", date);

      const index = result.findIndex((r) => r.labels === label && r.type === reporttype_to_string(data.type));
      if (index !== -1) result[index].value += 1;
    });

    if (result !== lineChartFilteredReports) setLineChartFilteredReports(result);
  }, [reportData, appliedChartTimeFilter, chartCategoryFilter, appliedChartCampusFilter, appliedChartLocationFilter]);

  useEffect(() => {
    if (!reportData) {
      return;
    }

    // Give early value for each stats
    const categoryStats: CategoryType[] = Object.keys(ReportType).map((value) => ({
      labels: value,
      value: 0,
    }));
    const statusStats: CategoryType[] = Object.keys(ReportStatus).map((value) => ({
      labels: value,
      value: 0,
    }));

    const percenStats: Record<string, number> = {};

    reportData.forEach((data) => {
      const catLabel = data.type.toString();
      const statLabel = data.status.toString();
      const percenLabel = reporttype_to_string(data.type);

      const catIdx = categoryStats.findIndex((r) => r.labels === catLabel);
      if (catIdx >= 0) categoryStats[catIdx].value += 1;
      else categoryStats.push({ labels: catLabel, value: 1 });

      const statIdx = statusStats.findIndex((r) => r.labels === statLabel);
      if (statIdx >= 0) statusStats[statIdx].value += 1;
      else statusStats.push({ labels: statLabel, value: 1 });

      percenStats[percenLabel] = (percenStats[percenLabel] || 0) + 1;
    });

    const formattedPercent = Object.entries(percenStats).map(([labels, value]) => ({
      labels,
      value,
    }));

    setPercentCategory(formattedPercent);
    setPercentStatus(statusStats);
    setPieCategory(categoryStats);
    setPieStatus(statusStats);
  }, [reportData]);

  return <></>;
}
