import { PrimeReactProvider } from "primereact/api";
import UsePICFilterHookEffect, { PICFilterTimeSpan, usePICFilterHook } from "../../../../../hooks/pages/Statistics/usePICFilterHook";
import { Dropdown } from "primereact/dropdown";
import strftime from "strftime";

export default function DateFilter() {
  const { startDateFilter, endDateFilter, currentTimeSpan, nextDate, prevDate, setCurrentTimeSpan } = usePICFilterHook();

  let dateFormat: string = "%d %b %Y";

  if(currentTimeSpan !== PICFilterTimeSpan.AllTime && startDateFilter.getFullYear() == new Date().getFullYear()) {
    dateFormat = "%d %b";
  }


  return <>
    <UsePICFilterHookEffect />
    <PrimeReactProvider>
      <div className="flex flex-col md:flex-row gap-2 items-center">
        <div className="w-full md:w-fit flex flex-row gap-2 text-xs md:text-base items-center justify-center px-2 h-12 shadow-lg rounded-md">
          <button onClick={prevDate} className="aspect-square cursor-pointer hover:bg-gray-200 h-3/5 disabled:opacity-0 disabled:pointer-events-none" disabled={currentTimeSpan === PICFilterTimeSpan.AllTime}><i className="pi pi-angle-left"></i></button>
          <p className="w-full text-center">{strftime(dateFormat, startDateFilter)} - {strftime(dateFormat, endDateFilter)}</p>
          <button onClick={nextDate} className="aspect-square cursor-pointer hover:bg-gray-200 h-3/5 disabled:opacity-0 disabled:pointer-events-none" disabled={currentTimeSpan === PICFilterTimeSpan.AllTime}><i className="pi pi-angle-right"></i></button>
        </div>
        <div className="w-full md:w-32 shadow-lg! rounded-md! h-12 flex items-center">
          <Dropdown className="bg-transparent! *:bg-transparent! *:text-white!" panelClassName="rounded-none! [&_.p-dropdown-item]:hover:text-white! [&_.p-dropdown-item]:hover:bg-[#f97316]! [&_.p-highlight]:bg-[#f97316]! [&_.p-focus]:bg-[#fd8b51]! bg-[#fd8b51]!" options={Object.values(PICFilterTimeSpan)} value={currentTimeSpan} onChange={(e) => setCurrentTimeSpan(e.value)} />
        </div>
      </div>
    </PrimeReactProvider>
  </>;
}