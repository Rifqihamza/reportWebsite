import strftime from "strftime";
import { PICFilterTimeSpan, usePICFilterHook } from "../../../../../hooks/pages/Statistics/usePICFilterHook";

export default function DateFilterTimeRange() {
  const { startDateFilter, endDateFilter, currentTimeSpan, nextDate, prevDate } = usePICFilterHook();

  let dateFormat: string = "%d %b %Y";

  if (currentTimeSpan !== PICFilterTimeSpan.AllTime && startDateFilter.getFullYear() == new Date().getFullYear()) {
    dateFormat = "%d %b";
  }

  return (
    <>
      <button
        onClick={prevDate}
        className="aspect-square cursor-pointer hover:bg-gray-200 h-3/5 disabled:opacity-0 disabled:pointer-events-none"
        disabled={currentTimeSpan === PICFilterTimeSpan.AllTime}
      >
        <i className="pi pi-angle-left"></i>
      </button>
      <p className="w-full text-center">
        {strftime(dateFormat, startDateFilter)} - {strftime(dateFormat, endDateFilter)}
      </p>
      <button
        onClick={nextDate}
        className="aspect-square cursor-pointer hover:bg-gray-200 h-3/5 disabled:opacity-0 disabled:pointer-events-none"
        disabled={currentTimeSpan === PICFilterTimeSpan.AllTime}
      >
        <i className="pi pi-angle-right"></i>
      </button>
    </>
  );
}
