import ReportListComponent from "../../components/ReportListComponent";
import type { User } from "../../types/variables";
import TieredDropDowns from "../../components/TieredMenu";

// icon
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';

export default function ListDataReport({ userData }: { userData: User }) {

  return (
    <>
      {/* Header Title */}
      <div className="flex flex-row gap-2 justify-center items-center mb-4 md:justify-normal">
        <AssignmentIcon fontSize="medium" />
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
              className="w-full pl-9 pr-4 py-2 border placeholder:text-md border-gray-300 rounded-lg outline-none"
            />
            <SearchIcon fontSize="small" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Filter Dropdown */}
          <div className="w-fit">
            <TieredDropDowns label="Filter" />
          </div>
        </div>

        <ReportListComponent userData={userData} />
      </div>
    </>
  );
}
