import { Accordion, AccordionTab } from "primereact/accordion";
import { Campus } from "../../../../../types/variables";
import { useLineChartHook } from "../../../../../hooks/pages/Statistics/useChartHook";

export default function CampusChartFilter() {
  const { chartCampusFilter, toggleChartCampusFilter } = useLineChartHook();
  
  const LineChartCampusFilter = <>{Object.values(Campus).map((campus, index) => {
      return <button key={index} className={`hover:bg-gray-500 p-4 rounded-2xl duration-200 w-full border-2 border-[#1f324d] ${chartCampusFilter.includes(campus) ? "bg-[#1f324d]! text-white!" : ""}`} onClick={() => toggleChartCampusFilter(campus)}>{campus}</button>
  })}</>;
  
  return (
    <>
      <div className="w-full">
        <Accordion>
          <AccordionTab
            header="Filter Kampus"
            className="[&_.p-accordion-header-link]:bg-white! [&_.p-accordion-header-link]:rounded-lg! [&.p-toggleable-content]:rounded-b-lg! [&.p-toggleable-content]:border-1! [&.p-toggleable-content]:border-white! [&.p-toggleable-content]:*:rounded-b-lg! [&.p-toggleable-content]:-translate-y-4"
          >
            <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full mt-4">{LineChartCampusFilter}</div>
          </AccordionTab>
        </Accordion>
      </div>
    </>
  );
}
