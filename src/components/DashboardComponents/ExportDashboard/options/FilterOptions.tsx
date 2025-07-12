import { ListBox } from "primereact/listbox";
import { filterOptions, useExportHook } from "../../../../hooks/pages/Export/useExportHook";
import { ReportType, reporttype_to_string, type ReportData } from "../../../../types/variables";
import { capitalize } from "../../../../utils/other";
import { Accordion, AccordionTab } from "primereact/accordion";

export default function FilterOptions() {
  const { filter, setFilter } = useExportHook();

  return <>
    <div className="bg-[#FD8B51] rounded-xl w-full h-full shadow-sm shadow-gray-400 col-span-3 row-span-2 row-start-2 col-start-3 flex flex-col relative">
      <div className="absolute -top-2 -right-2 bg-[#257180] rounded-full p-2 w-8 h-8 flex items-center justify-center shadow-md shadow-gray-700">
        <h1 className="text-white font-medium">2</h1>
      </div>
      <h1 className="text-xl text-white py-3 px-6 text-center">Opsi Filter</h1>
      <div className="bg-[#257180] h-full rounded-xl justify-center p-2 overflow-y-auto overflow-x-hidden relative">
        <div className="w-full h-full overflow-y-auto flex flex-col gap-4">
          <Accordion className="p-2 flex flex-col gap-2 [&_.p-accordion-content]:bg-transparent! [&_.p-accordion-header-link]:rounded-xl! [&_.p-accordion-header-link]:bg-[#257180]! [&_.p-accordion-header-link]:text-white! [&_.p-accordion-content]:rounded-xl! [&_.p-accordion-content]:mt-3! [&_.p-accordion-content]:border-2! [&_.p-accordion-content]:border-white! [&_.p-accordion-header-link]:border-2!">
            {Object.entries(filterOptions).map(([key, options]) => {
              const filterKey = key as keyof ReportData;
              const displayOptions = key === "type" ? options.map(reporttype_to_string) : options;
              const selectedValues = filter[filterKey] || [];

              const listBoxOptions = displayOptions.map((option) => ({
                label: option,
                value: option
              }));

              return (
                <AccordionTab key={key} header={capitalize(key)}>
                  <ListBox
                    className="[&_.p-listbox-list]:space-y-1! [&_.p-listbox-list-wrapper]:mx-1! w-full h-full"
                    value={selectedValues}
                    onChange={(e) => {
                      const newValues = e.value as string[];
                      setFilter(filterKey, newValues);
                    }}
                    options={listBoxOptions}
                    multiple
                  />
                </AccordionTab>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  </>;
}