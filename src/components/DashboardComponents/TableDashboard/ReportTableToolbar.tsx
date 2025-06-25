import { Calendar } from "primereact/calendar";
import { useReportFilterHook } from "../../../hooks/useReportHook";
import FilterSelect from "../SelectFilter/SelectFilterComponent";

export default function ReportTableToolbar() {
  const { setSearchKeyword, dateFilter, setDateFilter, searchKeyword } = useReportFilterHook();

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2">
        {/* Search Bar */}
        <div className="relative w-full flex items-center gap-4">
          <input
            type="text"
            id="search-input"
            placeholder="Cari laporan..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl placeholder-black ${searchKeyword.length > 0 ? "bg-[#7fa1c3] text-white" : "bg-white"}`}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
        </div>
        <div className="flex items-center gap-2 w-full">
          <Calendar
            className={`w-full *:cursor-pointer *:placeholder:opacity-50! ${dateFilter[0] ? "[&_.p-inputtext]:bg-[#7fa1c3]! [&_.p-inputtext]:text-white!" : ""}`}
            inputId="from-date"
            value={dateFilter ? dateFilter[0] : null}
            onChange={(e) => setDateFilter([e.value?.getTime() === dateFilter[0]?.getTime() ? null : e.value ?? null, dateFilter[1] ?? null])}
            readOnlyInput
            hideOnRangeSelection
            placeholder="Dari tanggal"
          />
          <span className="text-white text-4xl">-</span>
          <Calendar
            className={`w-full *:cursor-pointer *:placeholder:opacity-50! ${dateFilter[1] ? "[&_.p-inputtext]:bg-[#7fa1c3]! [&_.p-inputtext]:text-white!" : ""}`}
            inputId="until-date"
            value={dateFilter ? dateFilter[1] : null}
            onChange={(e) => setDateFilter([dateFilter[0] ?? null, e.value?.getTime() === dateFilter[1]?.getTime() ? null : e.value ?? null])}
            readOnlyInput
            hideOnRangeSelection
            placeholder="Sampai tanggal"
          />
        </div>
        <FilterSelect />
      </div>
    </>
  );
}
