import { Calendar } from "primereact/calendar";
import { useExportHook } from "../../../../../hooks/pages/Export/useExportHook";

export default function DateRangeOptionsCalendar() {
  const { dateRange, setStartDate, setEndDate } = useExportHook();

  return (
    <>
      <Calendar
        inputId="start-date"
        className={`*:cursor-pointer w-full h-full lg:*:text-sm! [&_.p-inputtext]:bg-[#1A1D24]! [&_.p-inputtext]:placeholder:text-white! *:text-white! rounded-xl hover:brightness-75 ${dateRange[0] ? "[&_.p-inputtext]:border! [&_.p-inputtext]:border-white! [&_.p-inputtext]:rounded-lg!" : ""}`}
        placeholder="Tidak terbatas"
        value={dateRange[0]}
        onChange={(e) => (e.value?.valueOf() != dateRange[0]?.valueOf() ? setStartDate(e.value || null) : setStartDate(null))}
      />
      <p className="text-white font-bold text-2xl">-</p>
      <Calendar
        inputId="end-date"
        className={`*:cursor-pointer w-full h-full lg:*:text-sm! [&_.p-inputtext]:bg-[#1A1D24]! [&_.p-inputtext]:placeholder:text-white! *:text-white! rounded-xl hover:brightness-75 ${dateRange[1] ? "[&_.p-inputtext]:border! [&_.p-inputtext]:border-white! [&_.p-inputtext]:rounded-lg!" : ""}`}
        placeholder="Tidak terbatas"
        value={dateRange[1]}
        onChange={(e) => (e.value?.valueOf() != dateRange[1]?.valueOf() ? setEndDate(e.value || null) : setEndDate(null))}
      />
    </>
  );
}
