import { useLineChartHook } from "../../../../hooks/useChartHook";
import { Campus } from "../../../../types/variables";

export default function ChartLineCampusFilter() {
  const { chartCampusFilter, toggleChartCampusFilter } = useLineChartHook();

  return <>
    {Object.values(Campus).map((campus, index) => {
        return <button key={index} className={`hover:bg-gray-500 p-4 rounded-2xl duration-200 w-full border-2 border-[#1f324d] ${chartCampusFilter.includes(campus) ? "bg-[#1f324d]! text-white!" : ""}`} onClick={() => toggleChartCampusFilter(campus)}>{campus}</button>
    })}
  </>
}