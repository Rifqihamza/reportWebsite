import ReactApexChart from "react-apexcharts";
import { ReportStatus, statusColorHex } from "../../../../../types/variables";
import UsePICReportCountHookEffect, { usePICReportCountHook } from "../../../../../hooks/pages/Statistics/usePICReportCountHook";

export default function ReportCountChart() {
  const { picReportCountSeries, picReportCountNames } = usePICReportCountHook();
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "90%",
        colors: {
          ranges: [
            {
              from: 0,
              to: 0,
              color: "#fff"
            }
          ]
        }
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 12,
    },
    xaxis: {
      categories: picReportCountNames,
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
          if(val === 0) return "";
          return val + " laporan";
        },
      },
    },
    fill: {
      opacity: 1,
      colors: [statusColorHex[ReportStatus.Complete], statusColorHex[ReportStatus.Hold], statusColorHex[ReportStatus.NotStarted], statusColorHex[ReportStatus.InProcess]],
    },
    legend: {
      position: "top",
    },
  };

  return (
    <>
      <UsePICReportCountHookEffect />
      <div className="shadow p-2 rounded-2xl">
        <ReactApexChart options={options} height={500} type="bar" series={picReportCountSeries} />
      </div>
    </>
  );
}
