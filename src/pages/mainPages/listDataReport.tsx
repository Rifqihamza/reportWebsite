import type { User } from "../../types/variables";
import ReportListComponent from "../../components/ReportListComponent";
import type { User } from "../../types/variables";


export default function ListDataReport({ userData }: { userData: User }) {

    return <>
      <div>
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="font-bold uppercase tracking-[2px] text-md flex flex-row gap-2 items-center">
            <img src="../../../../reportDataIcon.svg" className="w-6 h-6" alt="" />
            Data Laporan
          </h2>

            <div className="flex space-x-2">
            <div className="relative">
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>

            <button
                id="filter-button"
                className="bg-[#7FA1C3] shadow-inner shadow-zinc-500 text-white px-6 py-3 rounded-lg hover:bg-zinc-900 transition-colors"
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              ></path>
              </svg>
            </button>
          </div>
        </div>

        <ReportListComponent userData={userData} />
      </div>
    </>
}