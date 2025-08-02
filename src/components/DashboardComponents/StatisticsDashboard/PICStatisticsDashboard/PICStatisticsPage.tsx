import { PrimeReactProvider } from "primereact/api";
import { useDashboardNavbarHook } from "../../../../hooks/shared/useDashboardNavbar";
import React, { Suspense } from "react";
import LoadingAnimation from "../../../GlobalComponents/Loading/LoadingAnimation";
import PICCOmpactData from "./outputs/PICCompactData";
import UserRankTable from "./outputs/ReporterRankTable";
import DateFilter from "./filter/DateFilter";

const ReportCountChart = React.lazy(() => import("./outputs/PICReportCountChart"));
const RankingTable = React.lazy(() => import("./outputs/PICRankTable"));

export default function PICStatisticsPage() {
  const { activeTab } = useDashboardNavbarHook();

  if(activeTab !== 6) {
      return <></>;
  }

  return <>
    <PrimeReactProvider>
      <div className='flex flex-col mx-4 mt-2'>
        <h1 className="text-3xl">PIC Statistics</h1>

        {/* Filter Table */}
        <div className="mt-10 rounded-2xl shadow p-4">  
          <DateFilter />
        </div>

        {/* Box Data */}
        <div className="mt-10 rounded-2xl shadow p-4">
          <h1 className="mb-4 text-2xl">Quick Glance of Data</h1>
          <PICCOmpactData />
        </div>
        
        {/* Reports Count Chart */}
        <div className="mt-10 rounded-2xl shadow py-4 px-2 md:px-4 min-h-68">
          <h1 className="mb-4 text-2xl">Report Count</h1>
          <Suspense fallback={<div className="w-full h-full relative"><LoadingAnimation /></div>}>
            <ReportCountChart />
          </Suspense>
        </div>

        {/* Ranking Table */}
        <div className="mt-10 rounded-2xl shadow p-4 min-h-80">
          <h1 className="mb-4 text-2xl">Tabel Ranking PIC</h1>
          <Suspense fallback={<div className="w-full h-full relative"><LoadingAnimation /></div>}>
            <RankingTable />
          </Suspense>
        </div>

        {/* Ranking Table */}
        <div className="mt-10 rounded-2xl shadow p-4 min-h-80">
          <h1 className="mb-4 text-2xl">Tabel Ranking Pelapor</h1>
          <Suspense fallback={<div className="w-full h-full relative"><LoadingAnimation /></div>}>
            <UserRankTable />
          </Suspense>
        </div>
        
      </div>
    </PrimeReactProvider>
  </>;
}