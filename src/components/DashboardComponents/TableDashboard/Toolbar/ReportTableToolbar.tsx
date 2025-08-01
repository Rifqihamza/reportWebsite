import { Calendar } from "primereact/calendar";
import { useReportFilterHook } from "../../../../hooks/pages/ReportTable/useReportHook";
import FilterSelect from "./SelectFilterComponent";
import { PrimeReactProvider } from "primereact/api";

export default function ReportTableToolbar() {
  const { setSearchKeyword, dateFilter, setDateFilter, searchKeyword } = useReportFilterHook();

  return (
    <>
      <PrimeReactProvider>
        <div className="flex flex-col gap-3">
          {/* Search Bar */}
          <div className="relative w-full flex items-center gap-4">
            <input
              type="text"
              id="search-input"
              placeholder="Cari laporan..."
              className={`w-full pl-9 pr-11 py-3 rounded-xl text-gray-600 placeholder-black outline-none shadow-inner shadow-gray-400 ${searchKeyword.length > 0 ? "shadow-inner shadow-gray-400" : ""}`}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
              <FilterSelect />
          </div>
          <div className="flex items-center gap-2 w-full">
            <Calendar
              className={`w-full *:cursor-pointer *:placeholder:opacity-50! [&_.p-inputtext]:shadow-inner [&_.p-inputtext]:shadow-gray-400 ${dateFilter[0] ? " " : ""}`}
              inputId="from-date"
              value={dateFilter ? dateFilter[0] : null}
              onChange={(e) => setDateFilter([e.value?.getTime() === dateFilter[0]?.getTime() ? null : e.value ?? null, dateFilter[1] ?? null])}
              readOnlyInput
              hideOnRangeSelection
              placeholder="Dari tanggal"
            />
            <span className="text-black text-4xl">-</span>
            <Calendar
              className={`w-full *:cursor-pointer *:placeholder:opacity-50! [&_.p-inputtext]:shadow-inner [&_.p-inputtext]:shadow-gray-400 ${dateFilter[1] ? "" : ""}`}
              inputId="until-date"
              value={dateFilter ? dateFilter[1] : null}
              onChange={(e) => setDateFilter([dateFilter[0] ?? null, e.value?.getTime() === dateFilter[1]?.getTime() ? null : e.value ?? null])}
              readOnlyInput
              hideOnRangeSelection
              placeholder="Sampai tanggal"
            />
          </div>
        </div>
      </PrimeReactProvider>
    </>
  );
}
