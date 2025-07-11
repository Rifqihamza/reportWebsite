import { Dropdown } from "primereact/dropdown";
import { LineChartTimeCategoryOption, useLineChartHook } from "../../../../hooks/pages/Statistics/useChartHook";
import { Accordion, AccordionTab } from "primereact/accordion";

export default function TimeChartFilter() {
  const { chartTimeFilter, setChartTimeCategoryFilter } = useLineChartHook();


  const LineChartTimeFilter = <>{Object.values(LineChartTimeCategoryOption).map((timeInfo, index) => {
    return <button key={index} className={`hover:bg-[#CB6040] p-4 rounded-2xl duration-200 w-full ${chartTimeFilter === timeInfo ? "bg-[#CB6040] text-white" : "text-white bg-[#FD8B51]"}`} onClick={() => setChartTimeCategoryFilter(timeInfo)}>{timeInfo}</button>
  })}</>;

  return <>
    <div className="w-full">
      <Accordion>
        <AccordionTab
          header="Rentang Waktu"
          className="
      [&_.p-accordion-header-link]:bg-[#257180]! 
      [&_.p-accordion-header-link]:text-white! 
      [&_.p-accordion-header-link]:rounded-2xl! 
      [&_.p-accordion-content]:mt-3 
      [&_.p-accordion-content]:bg-[#257180]! 
      [&_.p-accordion-content]:border-none! 
      [&_.p-accordion-content]:rounded-xl!
      [&_.p-accordion-content]:p-4
    "
        >
          <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full mt-4">{LineChartTimeFilter}</div>
        </AccordionTab>
      </Accordion>
    </div>
  </>;
}