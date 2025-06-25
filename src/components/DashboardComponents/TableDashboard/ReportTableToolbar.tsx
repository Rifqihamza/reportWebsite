import { Calendar } from "primereact/calendar";
import { FloatLabel } from "primereact/floatlabel";
import { useReportFilterHook } from "../../../hooks/useReportHook";
import FilterSelect from "../SelectFilter/SelectFilterComponent";

export default function ReportTableToolbar() {
  const { setSearchKeyword, dateFilter, setDateFilter } = useReportFilterHook();

  return (
    <>
      <div className="flex md:flex-row flex-col items-center gap-2">
        {/* Search Bar */}
        <div className="relative w-full flex items-center gap-4">
          <input
            type="text"
            id="search-input"
            placeholder="Cari laporan..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl placeholder-black"
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
        </div>
        <div className="flex items-center gap-2 w-full">
          <FloatLabel className="overflow-x-hidden w-full">
            <Calendar
              className="w-full *:cursor-pointer"
              inputId="from-date"
              value={dateFilter ? dateFilter[0] : null}
              onChange={(e) => setDateFilter([e.value?.getTime() === dateFilter[0]?.getTime() ? null : e.value ?? null, dateFilter[1] ?? null])}
              readOnlyInput
              hideOnRangeSelection
            />
            <label htmlFor="from-date" className="whitespace-nowrap w-fit text-center">
              Dari tanggal
            </label>
          </FloatLabel>
          <span className="text-white text-4xl">-</span>
          <FloatLabel className="overflow-x-hidden w-full">
            <Calendar
              className="w-full *:cursor-pointer"
              inputId="until-date"
              value={dateFilter ? dateFilter[1] : null}
              onChange={(e) => setDateFilter([dateFilter[0] ?? null, e.value?.getTime() === dateFilter[1]?.getTime() ? null : e.value ?? null])}
              readOnlyInput
              hideOnRangeSelection
            />
            <label htmlFor="until-date" className="whitespace-nowrap w-fit text-center">
              Sampai tanggal
            </label>
          </FloatLabel>
        </div>
        <FilterSelect />
      </div>
    </>
  );
}
