import ReactApexChart from "react-apexcharts";
import { statusColorHex } from "../../../../../types/variables";
import { usePieChartHook } from "../../../../../hooks/pages/Statistics/useReportStatisticsHook";

interface Props {
  pieType: "category" | "status";
}

export default function PieChartComponent({ pieType }: Props) {
  const { pieCategory, pieStatus } = usePieChartHook();
  // Hitung jumlah masing-masing jenis laporan
  const labels = Object.keys(pieType == "category" ? pieCategory : pieStatus);
  const series = Object.values(pieType == "category" ? pieCategory : pieStatus);
  const colors = labels.map((label) => statusColorHex[label] || "#E0E0E0"); // default gray if not matched

  const options = {
    chart: {
      type: "pie" as const,
      data: series,
    },
    labels,
    colors,
    theme: {
      monochrome: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -20,
        },
      },
    },
    grid: {
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "10px",
        colors: ["#fff"],
      },
    },
    legend: {
      show: true,
      position: "bottom" as "bottom",
    },
  };

  if (!series.some((value) => value > 0)) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-white text-center opacity-50">Tidak ada yang dapat ditampilkan</p>
      </div>
    );
  }

  return <ReactApexChart options={options} series={series} type="pie" width="300" />;
}
