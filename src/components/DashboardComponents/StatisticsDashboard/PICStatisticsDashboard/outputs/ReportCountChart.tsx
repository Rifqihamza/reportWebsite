import ReactApexChart from "react-apexcharts";
import { ReportStatus, statusColorHex } from "../../../../../types/variables";

export default function ReportCountChart() {
  const series = [
    {
      name: "Completed",
      data: [4, 2, 4, 3, 4, 2, 4, 3, 4, 2, 4, 3, 4, 2, 4, 3],
    },
    {
      name: "Hold",
      data: [1, 0, 2, 4, 1, 0, 2, 4, 1, 0, 2, 4, 1, 0, 2, 4],
    },
    {
      name: "Not Started",
      data: [2, 3, 1, 1, 2, 3, 1, 1, 2, 3, 1, 1, 2, 3, 1, 1],
    },
    {
      name: "In Process",
      data: [2, 3, 0, 0, 2, 3, 0, 0, 2, 3, 0, 0, 2, 3, 0, 0],
    },
  ];
  const options: ApexCharts.ApexOptions = {
    series: series,
    chart: {
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "100%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 12,
    },
    xaxis: {
      categories: ["Pak Heas", "Pak Okta", "Pak Ambar", "Pak Dodi", "Pak Heas", "Pak Okta", "Pak Ambar", "Pak Dodi", "Pak Heas", "Pak Okta", "Pak Ambar", "Pak Dodi", "Pak Heas", "Pak Okta", "Pak Ambar", "Pak Dodi"],
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val + " laporan";
        },
      },
    },
    fill: {
      opacity: 1,
      colors: [statusColorHex[ReportStatus.Complete], statusColorHex[ReportStatus.Hold], statusColorHex[ReportStatus.NotStarted], statusColorHex[ReportStatus.InProcess]],
    },
    legend: {
      position: "bottom",
    },
  };

  return (
    <>
      <ReactApexChart options={options} height={500} type="bar" />
    </>
  );
}
