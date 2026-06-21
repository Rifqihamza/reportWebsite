import { ListBox } from "primereact/listbox";
import { filterOptions, useExportHook } from "../../../../../hooks/pages/Export/useExportHook";
import { reporttype_to_string, type ReportData } from "../../../../../types/variables";
import { capitalize } from "../../../../../utils/other";
import { useEffect, useState } from "react";

export default function FilterOptionsListBox() {
  const { filter, setFilter } = useExportHook();
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  const [shouldClose, setShouldClose] = useState<boolean>(true);

  function windowClick() {
    if (openedIndex !== null) {
      setTimeout(() => {
        if (shouldClose) setOpenedIndex(null);
        setShouldClose(true);
      }, 100);
    }
  }

  useEffect(() => {
    window.addEventListener("click", windowClick);
    return () => {
      window.removeEventListener("click", windowClick);
    };
  }, [openedIndex, shouldClose]);

  return (
    <>
      {Object.entries(filterOptions).map(([key, options], index) => {
        const filterKey = key as keyof ReportData;
        const displayOptions = key === "type" ? options.map(reporttype_to_string) : options;
        const selectedValues = filter[filterKey] || [];

        const listBoxOptions = displayOptions.map((option) => ({
          label: option,
          value: option,
        }));

        return (
          <div data-filter-element key={key} className="flex flex-col justify-center w-full h-full overflow-y-visible items-center relative" onClick={() => setShouldClose(false)}>
            <button
              className={`cursor-pointer z-10 w-full h-full p-[12px_24px] bg-[#1a1d24] text-white rounded-xl border ${selectedValues.length > 0 ? "border-white" : "border-transparent"}`}
              onClick={() => (index === openedIndex ? setOpenedIndex(null) : setOpenedIndex(index))}
            >
              {capitalize(key)}
            </button>
            <div
              className={`p-4 max-h-70 overflow-auto rounded-l-2xl bg-[#374151] border border-white z-11 w-full left-0 absolute top-[calc(26px_+_1.5rem_+6px)] duration-400 ${openedIndex === index ? "opacity-100 text-base" : "opacity-0 pointer-events-none"}`}
            >
              <ListBox
                className="[&_.p-listbox-list]:space-y-1.5! w-full h-full"
                value={selectedValues}
                onChange={(e) => {
                  const newValues = e.value as string[];
                  setFilter(filterKey, newValues);
                }}
                options={listBoxOptions}
                multiple
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
