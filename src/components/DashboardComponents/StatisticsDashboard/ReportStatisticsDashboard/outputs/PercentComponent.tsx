import { useMemo } from "react";
import { usePercentChartHook } from "../../../../../hooks/pages/Statistics/useReportStatisticsHook";
import { capitalize } from "../../../../../utils/other";

interface Report {
  labels: string;
  value: number;
}

interface Props {
  percentType: "category" | "status";
}

const statusColors: {
  [key: string]: string;
} = {
  NotStarted: "bg-red-100 text-red-800",
  InProcess: "bg-yellow-100 text-yellow-800",
  Complete: "bg-green-100 text-green-800",
  Hold: "bg-blue-100 text-blue-800",
  Abnormality: "text-white bg-yellow-500",
  "5R": "text-white bg-indigo-400",
  Safety: "text-white bg-orange-400",
};

export default function PercentComponent({ percentType }: Props) {
  const { percentCategory, percentStatus } = usePercentChartHook();

  // Normalize label "VR" ke "5R" dan kelompokkan
  const groupedReports = useMemo(() => {
    const result: Record<string, number> = {};
    for (const report of percentType == "category" ? percentCategory : percentStatus) {
      const normalizedLabel = report.labels === "VR" ? "5R" : report.labels;
      result[normalizedLabel] = (result[normalizedLabel] || 0) + report.value;
    }
    return result;
  }, [percentType == "category" ? percentCategory : percentStatus]);

  // Hitung total dan persentase
  const total = useMemo(() => Object.values(groupedReports).reduce((sum, val) => sum + val, 0), [groupedReports]);

  const percentageData = useMemo(() => {
    if (total !== 0) {
      return Object.entries(groupedReports).map(([name, value]) => ({
        name,
        value,
        percent: ((value / total) * 100).toFixed(1) + "%",
      }));
    }
    return [];
  }, [groupedReports, total]);

  return (
    <div className="min-h-24 bg-[#2b3440] border flex flex-col items-center border-white px-6 py-4 rounded-xl  space-y-4">
      <div className="flex flex-row justify-between items-center gap-10">
        <h1 className="text-md md:text-lg text-white font-bold">Persentase {capitalize(percentType.toString())}</h1>
      </div>
      <div className="h-full space-y-3 px-3 py-1">
        {(() => {
          if (percentageData.length === 0) {
            return <p className="text-white text-center w-full h-full flex justify-center items-center opacity-50">Tidak ada data yang dapat ditampilkan.</p>;
          }

          return percentageData.map((item, index) => (
            <div key={index} className="flex justify-between text-sm text-white">
              <span className={`${statusColors[item.name]} px-2 py-0.5 rounded-xl text-sm`}>{item.name}</span>
              <span className="font-semibold">{item.percent}</span>
            </div>
          ));
        })()}
      </div>
    </div>
  );
}
