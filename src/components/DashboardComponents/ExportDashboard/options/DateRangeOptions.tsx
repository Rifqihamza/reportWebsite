import { Calendar } from "primereact/calendar";
import { useExportHook } from "../../../../hooks/pages/Export/useExportHook";


export default function DateRangeOptions() {
  const { dateRange, setStartDate, setEndDate } = useExportHook();

  return <>
    <div className="bg-[#374151] w-full h-fit rounded-xl px-3">
      <div className="flex flex-col gap-2 md:flex-row md:gap-0 justify-between px-4 py-5">
        <div className="w-full">
          <h1 className="text-xl lg:text-2xl font-semibold text-white ">Range Waktu</h1>
          <span className="text-md lg:text-lg text-white flex flex-row items-center gap-3">
            Opsi Range Waktu yang akan di eksport
            <i className="pi pi-arrow-right hidden! md:inline!"></i>
          </span>
        </div>
        <div className="flex flex-row items-center gap-4 w-full h-14">
          <Calendar inputId="start-date" className={`*:cursor-pointer w-full h-full lg:*:text-sm! [&_.p-inputtext]:bg-[#1A1D24]! [&_.p-inputtext]:placeholder:text-white! *:text-white! rounded-xl hover:brightness-75 ${dateRange[0] ? "[&_.p-inputtext]:border! [&_.p-inputtext]:border-white! [&_.p-inputtext]:rounded-lg!" : ""}`} placeholder="Tidak terbatas" value={dateRange[0]} onChange={(e) => (e.value?.valueOf() != dateRange[0]?.valueOf()) ? setStartDate(e.value || null) : setStartDate(null)} />
          <p className="text-white font-bold text-2xl">-</p>
          <Calendar inputId="end-date" className={`*:cursor-pointer w-full h-full lg:*:text-sm! [&_.p-inputtext]:bg-[#1A1D24]! [&_.p-inputtext]:placeholder:text-white! *:text-white! rounded-xl hover:brightness-75 ${dateRange[1] ? "[&_.p-inputtext]:border! [&_.p-inputtext]:border-white! [&_.p-inputtext]:rounded-lg!" : ""}`} placeholder="Tidak terbatas" value={dateRange[1]} onChange={(e) => (e.value?.valueOf() != dateRange[1]?.valueOf()) ? setEndDate(e.value || null) : setEndDate(null)} />
        </div>
      </div>
    </div>
  </>;
}