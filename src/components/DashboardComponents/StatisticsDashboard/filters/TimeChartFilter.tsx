import { Dropdown } from "primereact/dropdown";
import { LineChartTimeCategoryOption, useLineChartHook } from "../../../../hooks/useChartHook";
import { Accordion, AccordionTab } from "primereact/accordion";

export default function TimeChartFilter() {
  const options = Object.values(LineChartTimeCategoryOption);

  const { chartTimeCategoryFilter, setChartTimeCategoryFilter } = useLineChartHook();

  
  const LineChartTimeFilter = <>{Object.values(LineChartTimeCategoryOption).map((timeInfo, index) => {
      return <button key={index} className={`hover:bg-gray-500 p-4 rounded-2xl duration-200 w-full border-2 border-[#1f324d] ${chartTimeCategoryFilter === timeInfo ? "bg-[#1f324d] text-white" : ""}`} onClick={() => setChartTimeCategoryFilter(timeInfo)}>{timeInfo}</button>
  })}</>;
  
  return <>
    <div className="w-full">
        <Accordion>
          <AccordionTab
            header="Rentang Waktu"
            className="[&_.p-accordion-header-link]:bg-white! [&_.p-accordion-header-link]:border-0! [&_.p-accordion-header-link]:rounded-lg! [&.p-toggleable-content]:rounded-b-lg! [&.p-toggleable-content]:border-1! [&.p-toggleable-content]:border-white! [&.p-toggleable-content]:*:rounded-b-lg! [&.p-toggleable-content]:-translate-y-4"
          >
            <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full mt-4">{LineChartTimeFilter}</div>
          </AccordionTab>
        </Accordion>
    </div>
  </>;
}