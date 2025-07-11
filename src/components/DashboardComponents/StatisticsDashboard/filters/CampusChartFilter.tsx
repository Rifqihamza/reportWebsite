import { Accordion, AccordionTab } from "primereact/accordion";
import { Campus } from "../../../../types/variables";
import { useLineChartHook } from "../../../../hooks/pages/Statistics/useChartHook";

export default function CampusChartFilter() {
  const { chartCampusFilter, toggleChartCampusFilter } = useLineChartHook();

  const LineChartCampusFilter = <>{Object.values(Campus).map((campus, index) => {
    return <button key={index} className={`hover:bg-[#CB6040] p-4 rounded-2xl duration-200 w-full ${chartCampusFilter.includes(campus) ? "bg-[#CB6040] text-white" : "text-white bg-[#FD8B51]"}`} onClick={() => toggleChartCampusFilter(campus)}>{campus}</button>
  })}</>;

  return (
    <>
      <div className="w-full">
        <Accordion>
          <AccordionTab
            header="Filter Kampus"
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
            <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full mt-4">{LineChartCampusFilter}</div>
          </AccordionTab>
        </Accordion>
      </div>
    </>
  );
}
