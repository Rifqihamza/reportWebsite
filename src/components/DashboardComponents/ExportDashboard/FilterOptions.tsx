import { Accordion, AccordionTab } from "primereact/accordion";
import { filterOptions, useExportHook } from "../../../hooks/useExportHook";
import { Campus, campus_to_campuscode, ReportType, reporttype_to_string, type ReportData } from "../../../types/variables";
import { capitalize } from "../../../utils/other";

export default function FilterOptions() {
  const { filter, setFilter } = useExportHook();
  
  return <>
    <div className="bg-[#1f324d] rounded-xl w-full h-fit lg:h-full shadow-sm shadow-gray-400 col-span-3 row-span-2 row-start-2 col-start-3 flex flex-col relative">
      <div className="absolute -top-2 -right-2 bg-[#263d5d] rounded-full p-2 w-8 h-8 flex items-center justify-center shadow-md shadow-gray-700">
        <h1 className="text-white font-medium">2</h1>
      </div>
      <h1 className="text-xl text-white py-3 px-6 text-center">Opsi Filter</h1>
      <div className="bg-[#ededed] h-full rounded-xl flex justify-center p-2 overflow-auto">
        <Accordion activeIndex={0} className="w-full [&_a]:bg-white!">
          {(() => {
            const filterOptionsLength = Object.keys(filterOptions).length - 1;
            
            return Object.entries(filterOptions).map(([key, options], index) => {
              if(key === "type") {
                options = options.map(value => reporttype_to_string(value as ReportType))
              }
              const current_filter = filter[key as keyof ReportData] ?? [];

              return <AccordionTab key={index} header={capitalize(key)} className={`flex flex-col border-2 border-black ${index === 0 ? "[&.p-accordion-header]:rounded-t-2xl [&.p-accordion-header]:*:rounded-t-2xl!" : ""} ${index === filterOptionsLength ? "[&.p-toggleable-content]:rounded-b-2xl [&.p-toggleable-content]:*:rounded-b-2xl!" : ""} ${index < filterOptionsLength ? "[&.p-accordion-header]:border-b-0" : "[&.p-toggleable-content]:border-t-0"}`}>
                {options.map((value, index) => {
                  return <button 
                    key={index} 
                    className={`${index === 0 ? "" : "mt-2"} w-full h-full cursor-pointer text-sm lg:text-md px-2 py-4 border-2 hover:brightness-75 rounded-xl ${current_filter.includes(value) ? "bg-[#17253a] text-white border-[#17253a]" : "text-black"} hover:brightness-75`} 
                    onClick={() => setFilter(key as keyof ReportData, current_filter.includes(value) ? current_filter.filter(option => option != value) : [...current_filter, value])}
                  >{value}</button>;
                })}
              </AccordionTab>;
            }); 
          })()}
        </Accordion>
      </div>
    </div>
  </>;
}