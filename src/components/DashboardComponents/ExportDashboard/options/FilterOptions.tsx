import { ListBox } from "primereact/listbox";
import { filterOptions, useExportHook } from "../../../../hooks/pages/Export/useExportHook";
import { reporttype_to_string, type ReportData } from "../../../../types/variables";
import { capitalize } from "../../../../utils/other";
import { Accordion, AccordionTab } from "primereact/accordion";

export default function FilterOptions() {
  const { filter, setFilter } = useExportHook();

  return <>
    <div className="bg-[#CB6040] w-full h-fit rounded-xl px-6">
      <div className="flex flex-row justify-between px-4 py-5">
        <div className="w-full">
          <h1 className="text-xl lg:text-2xl font-semibold text-white ">Filter Option</h1>
          <span className="text-md lg:text-lg text-white flex flex-row items-center gap-3">
            Opsi filter data yang akan di eksport
            <i className="pi pi-arrow-right"></i>
          </span>
        </div>
        <div className="w-full h-full overflow-y-auto flex flex-col gap-4">
          <Accordion className="px-4 py-3 flex flex-col-reverse gap-2 
            [&_.p-accordion-header-link]:rounded-xl! 
          [&_.p-accordion-header-link]:bg-[#257180]!
          [&_.p-accordion-header-link]:text-white!
            [&_.p-accordion-header-link]:border-none!
            [&_.p-accordion-content]:rounded-xl!
            [&_.p-accordion-content]:mt-3!
            [&_.p-accordion-content]:border-none!
            [&_.p-accordion-content]:bg-[#FD8B51]!
            ">
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
                    className="[&_.p-listbox-list]:space-y-1.5! w-full h-full "
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