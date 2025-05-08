import type { Dispatch, SetStateAction } from "react";
import ReportListComponent from "../../components/ReportListComponent";
import type { ReportData, User } from "../../types/variables";
import { useState } from "react";
import TieredDropDowns from "../../components/TieredMenu";


interface Status {
    name: string;
    code: string;
}

export default function ListDataReport({ userData, reports, setReports }: { userData: User, reports: ReportData[], setReports: Dispatch<SetStateAction<ReportData[]>> }) {
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const status: Status[] = [
    { name: 'Complete', code: 'C' },
    { name: 'In Process', code: 'IPr' },
    { name: 'Not Started', code: 'NS' },
    { name: 'Hold', code: 'H' },
  ];

  return (
    <>
      {/* Header Title */}
      <div className="flex flex-row gap-2 justify-center items-center mb-4 md:justify-normal">
        <img src="/reportDataIcon.svg" className="md:w-6 w-6 h-auto" alt="report icon" />
        <h1 className="font-bold uppercase tracking-[2px] text-md md:text-lg text-black">
          Data Laporan
        </h1>
      </div>

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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filter Dropdown */}
          <div className="w-fit">
            <TieredDropDowns />
          </div>
        </div>

        <ReportListComponent userData={userData} reports={reports} setReports={setReports}  />
      </div>
    </>
  );
}
