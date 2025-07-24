import { PrimeReactProvider } from "primereact/api";
import UsePICFilterHookEffect, { PICFilterTimeSpan, usePICFilterHook } from "../../../../../hooks/pages/Statistics/usePICFilterHook";
import { Dropdown } from "primereact/dropdown";
import strftime from "strftime";

export default function DateFilter() {
  const { startDateFilter, endDateFilter, currentTimeSpan, nextDate, prevDate, setCurrentTimeSpan } = usePICFilterHook();

  let dateFormat: string = "%d %b %Y";

  if(startDateFilter.getFullYear() == new Date().getFullYear()) {
    dateFormat = "%d %b";
  }


  return <>
    <UsePICFilterHookEffect />
    <PrimeReactProvider>
      <div className="flex flex-row gap-2 items-center">
        <div className="flex flex-row gap-2 items-center justify-center px-2 h-12 shadow-lg rounded-md">
          <button onClick={prevDate} className="aspect-square cursor-pointer hover:bg-gray-200 h-4/5"><i className="pi pi-angle-left"></i></button>
          <p className="w-full">{strftime(dateFormat, startDateFilter)} - {strftime(dateFormat, endDateFilter)}</p>
          <button onClick={nextDate} className="aspect-square cursor-pointer hover:bg-gray-200 h-4/5"><i className="pi pi-angle-right"></i></button>
        </div>
        <div className="w-32 shadow-lg! rounded-md! h-12 flex items-center">
          <Dropdown className="bg-white! *:bg-white! [&_.p-dropdown-trigger]:rounded-md!" options={Object.values(PICFilterTimeSpan)} value={currentTimeSpan} onChange={(e) => setCurrentTimeSpan(e.value)} />
        </div>
      </div>
    </PrimeReactProvider>
  </>;
}