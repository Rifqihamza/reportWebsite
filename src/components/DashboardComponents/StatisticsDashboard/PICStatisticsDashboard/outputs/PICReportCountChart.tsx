import ReactApexChart from "react-apexcharts";
import { ReportStatus, statusColorHex } from "../../../../../types/variables";
import UsePICReportCountHookEffect, { usePICReportCountHook } from "../../../../../hooks/pages/Statistics/usePICReportCountHook";

export default function ReportCountChart() {
  const { picReportCountSeries, picReportCountNames, page, maxPage, maxValue, setPage } = usePICReportCountHook();
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "90%",
        colors: {
          ranges: [
            {
              from: 0,
              to: 0,
              color: "#00000000"
            }
          ]
        }
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
    },
    xaxis: {
      categories: picReportCountNames,
      max: maxValue,
      stepSize: 1,
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
      <div className="shadow md:p-2 rounded-2xl flex flex-col">
        <div className="overflow-auto">
          <div className="min-w-[300px] w-full pt-4">
            <ReactApexChart options={options} height={500} type="bar" series={picReportCountSeries} />
          </div>
        </div>
        <div className="py-4 flex flex-row gap-4 w-full justify-center">
            <button
              className="disabled:opacity-50 text-white px-2 py-1 rounded-lg bg-gray-600 duration-300 flex flex-row items-center justify-around"
              disabled={page <= 0}
              onClick={() => setPage(page - 1)}
            >
                <i className="pi pi-angle-left"></i>
                Prev
            </button>
            <button
                className="disabled:opacity-50 text-white px-2 py-1 rounded-lg bg-gray-600 duration-300 flex flex-row items-center justify-around"
                disabled={page >= (maxPage - 1)}
                onClick={() => setPage(page + 1)}
            >
                Next
                <i className="pi pi-angle-right"></i>
            </button>
        </div>
      </div>
    </>
  );
}
