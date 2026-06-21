import ReactApexChart from "react-apexcharts";
import { LineChartTimeCategoryOption, listOfDay, listOfMonths, useLineChartHook, usePieChartHook } from "../../../../../hooks/pages/Statistics/useReportStatisticsHook";
import { ReportType, reporttype_to_string, statusColorHex } from "../../../../../types/variables";

const maxYAxisSnapLength = 10;

export default function LineCharComponent() {
  const { lineChartFilteredReports } = useLineChartHook();
  const { appliedChartTimeFilter } = useLineChartHook();
  const { lineChartCategoryFilter } = usePieChartHook();

  const lineChartFilteredReportColors = lineChartCategoryFilter
    ? [statusColorHex[reporttype_to_string(lineChartCategoryFilter)]]
    : Object.values(ReportType).map((type) => statusColorHex[reporttype_to_string(type)]);

  lineChartFilteredReports.sort((a, b) => {
    if (appliedChartTimeFilter === LineChartTimeCategoryOption.Year) {
      return listOfMonths.indexOf(a.labels) - listOfMonths.indexOf(b.labels);
    } else if (appliedChartTimeFilter === LineChartTimeCategoryOption.Month) {
      return Number.parseInt(a.labels) - Number.parseInt(b.labels);
    } else if (appliedChartTimeFilter === LineChartTimeCategoryOption.Week) {
      return listOfDay.indexOf(a.labels) - listOfDay.indexOf(b.labels);
    } else {
      return Number.parseInt(a.labels) - Number.parseInt(b.labels);
    }
  });
  const categories = Array.from(
    new Set(
      [...lineChartFilteredReports].map((r) => {
        return r.labels;
      }),
    ),
  );
  const types = Array.from(new Set(lineChartFilteredReports.map((r) => r.type)));

  const grouped: Record<string, Record<string, number>> = {};
  types.forEach((type) => {
    grouped[type] = {};
    categories.forEach((label) => {
      grouped[type][label] = 0;
    });
  });

  lineChartFilteredReports.forEach((report) => {
    grouped[report.type][report.labels] += report.value;
  });

  const series = types.map((type) => ({
    name: type,
    data: categories.map((label) => grouped[type][label]),
  }));

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line" as const,
      background: "transparent",
      foreColor: "#fff",
    },
    theme: {
      palette: "palette1",
    },
    colors: lineChartFilteredReportColors,
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories,
    },
    yaxis: {
      max: lineChartFilteredReports.length > 0 ? maxYAxisSnapLength * Math.ceil(lineChartFilteredReports.sort((a, b) => b.value - a.value)[0].value / maxYAxisSnapLength + 0.1) : 0,
    },
    markers: {
      size: 4,
    },
    legend: {
      position: "bottom" as const,
    },
    stroke: {
      curve: "smooth" as const,
    },
    tooltip: {
      style: {
        background: "#ffffff",
      },
    },
  };

  return <ReactApexChart options={options} series={series} type="line" height={300} />;
}
