import ReportListComponent from "../../components/ReportListComponent";
import type { User } from "../../types/variables";


export default function ListDataReport({ userData }: { userData: User }) {

  return (
    <>
      {/* Header Title */}
      <div className="flex flex-row gap-2 justify-center items-center mb-4 md:justify-normal">
        <img src="/reportDataIcon.svg" className="md:w-6 h-auto w-6 h-auto" alt="" />
        <h1 className="font-bold uppercase tracking-[2px] text-md md:text-lg text-black">Data Laporan</h1>
      </div>
      {/* End Header Title */}

      <div className="px-4 space-y-3">
        <div className="flex flex-row items-center gap-2">
          {/* Search Bar */}
          <div className="relative w-full">
            <input
              type="text"
              id="search-input"
              placeholder="Cari laporan..."
              className="w-full pl-9 pr-4 py-2 border placeholder:text-xs border-gray-300 rounded-lg outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          {/* End Search Bar */}
          {/* Filter Button */}
          <button
            id="filter-button"
            className="bg-[#7FA1C3] shadow-inner shadow-zinc-500 text-white hover:text-gray-400 px-6 py-3 rounded-lg hover:bg-[#fff] transition-colors"
            aria-label="Filter"
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              ></path>
            </svg>
          </button>
          {/* End Filter Button */}
        </div>
        <ReportListComponent userData={userData} />
      </div>
    </>
  )
}