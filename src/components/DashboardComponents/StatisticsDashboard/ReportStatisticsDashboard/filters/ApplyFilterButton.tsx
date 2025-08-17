import { useLineChartHook } from "../../../../../hooks/pages/Statistics/useReportStatisticsHook";

export default function ApplyFilterButton() {
  const { appliedChartCampusFilter, chartCampusFilter, appliedChartLocationFilter, chartLocationFilter, appliedChartTimeFilter, chartTimeFilter, applyFilter } = useLineChartHook();
  const isChange = !(
    (appliedChartCampusFilter.length > chartCampusFilter.length ? appliedChartCampusFilter.every((campus) => chartCampusFilter.includes(campus)) : chartCampusFilter.every((campus) => appliedChartCampusFilter.includes(campus))) &&
    (appliedChartLocationFilter.length > chartLocationFilter.length ? appliedChartLocationFilter.every((location) => chartLocationFilter.includes(location)) : chartLocationFilter.every((location) => appliedChartLocationFilter.includes(location))) &&
    appliedChartTimeFilter === chartTimeFilter
  );

  
  return <>
    <button 
      className={`w-full h-fit py-3 bg-[#2b3440] text-white border border-white disabled:text-[#495057] font-bold rounded-lg cursor-pointer hover:brightness-75 disabled:opacity-75 disabled:brightness-75 disabled:cursor-not-allowed`}
      onClick={() => applyFilter()}
      disabled={!isChange}
    >
      Terapkan Filter
    </button>
  </>;
}