import { Calendar } from "primereact/calendar";
import { useReportFilterHook } from "../../../../hooks/pages/ReportTable/useReportHook";
import FilterSelect from "./SelectFilterComponent";
import { PrimeReactProvider } from "primereact/api";

export default function ReportTableToolbar() {
  const { setSearchKeyword, dateFilter, setDateFilter, searchKeyword } = useReportFilterHook();

  return (
    <>
      <PrimeReactProvider>
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full flex items-center gap-4">
            <input
              type="text"
              id="search-input"
              placeholder="Cari laporan..."
              className={`w-full pl-10 pr-13 py-3 rounded-xl placeholder-white! bg-[#257180] outline-none ${searchKeyword.length > 0 ? "text-white" : ""}`}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
            <span className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <FilterSelect />
            </span>
          </div>
          <div className="flex flex-row gap-3 items-center">

            <Calendar
              className={`w-fit h-full *:cursor-pointer *:placeholder:text-white! [&_.p-inputtext]:py-3! [&_.p-inputtext]:bg-[#cb6040]! [&_.p-inputtext]:text-white! ${dateFilter[0] ? " " : ""}`}
              inputId="from-date"
              value={dateFilter ? dateFilter[0] : null}
              onChange={(e) => setDateFilter([e.value?.getTime() === dateFilter[0]?.getTime() ? null : e.value ?? null, dateFilter[1] ?? null])}
              readOnlyInput
              hideOnRangeSelection
              placeholder="Dari tanggal"
            />
            <span className="text-black text-4xl">-</span>
            <Calendar
              className={`w-fit h-full *:cursor-pointer *:placeholder:text-white! [&_.p-inputtext]:py-3! [&_.p-inputtext]:bg-[#cb6040]! [&_.p-inputtext]:text-white! ${dateFilter[1] ? " " : ""}`}
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
