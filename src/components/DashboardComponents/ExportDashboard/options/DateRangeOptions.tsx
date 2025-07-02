import { Calendar } from "primereact/calendar";
import { useExportHook } from "../../../../hooks/useExportHook";


export default function DateRangeOptions() {
  const { dateRange, setStartDate, setEndDate } = useExportHook();

  return <>
    <div className="bg-[#1f324d] w-full h-fit rounded-xl shadow-sm shadow-gray-400 col-span-3 flex flex-col relative">
      <div className="absolute -top-2 -right-2 bg-[#263d5d] rounded-full p-2 w-8 h-8 flex items-center justify-center shadow-md shadow-gray-700">
        <h1 className="text-white font-medium">3</h1>
      </div>
      <h1 className="text-md lg:text-xl text-white py-3 px-6 text-center">Rentang Waktu Data</h1>
      <div className="bg-[#ededed] h-full rounded-xl p-4 gap-2 flex flex-row items-center justify-center">
        <Calendar inputId="start-date" className={`*:cursor-pointer w-full h-fit lg:*:text-sm! border-2 border-[#1f324d] rounded-xl hover:brightness-75 ${dateRange[0] ? "*:font-normal!" : "*:text-gray-500! *:font-thin!"}`} placeholder="Tidak terbatas" value={dateRange[0]} onChange={(e) => (e.value?.valueOf() != dateRange[0]?.valueOf()) ? setStartDate(e.value || null) : setStartDate(null)} />
        <p>-</p>
        <Calendar inputId="end-date" className={`*:cursor-pointer w-full h-fit lg:*:text-sm! border-2 border-[#1f324d] rounded-xl hover:brightness-75 ${dateRange[1] ? "*:font-normal!" : "*:text-gray-500! *:font-thin!"}`} placeholder="Tidak terbatas" value={dateRange[1]} onChange={(e) => (e.value?.valueOf() != dateRange[1]?.valueOf()) ? setEndDate(e.value || null) : setEndDate(null)} />
      </div>
    </div>
  </>;
}