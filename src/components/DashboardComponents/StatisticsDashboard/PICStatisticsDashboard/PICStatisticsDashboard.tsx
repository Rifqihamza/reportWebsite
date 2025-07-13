import { PrimeReactProvider } from "primereact/api";
import { useDashboardNavbarHook } from "../../../../hooks/shared/useDashboardNavbar";
import CompactBoxData from "./outputs/CompactBoxData";
import React, { Suspense } from "react";
import LoadingAnimation from "../../../GlobalComponents/Loading/LoadingAnimation";

const ReportCountChart = React.lazy(() => import("./outputs/ReportCountChart"));

export default function PICStatisticsDashboard() {
  const { activeTab } = useDashboardNavbarHook();

  if(activeTab !== 6) {
      return <></>;
  }

  return <>
    <PrimeReactProvider>
      <div className='flex flex-col mx-4 mt-2'>
        <h1 className="text-3xl">PIC Statistics</h1>

        {/* Box Data */}
        <div className="mt-10 rounded-2xl shadow p-4">
          <h1 className="mb-4 text-2xl">Quick Glance of Data</h1>
          <div className="flex flex-col md:flex-row gap-2">
            <CompactBoxData label="MIN" value={0} description="Jumlah laporan paling sedikit yang dimiliki PIC" unit="laporan" />
            <CompactBoxData label="AVG" value={5} description="Rata-rata jumlah laporan yang dimiliki PIC"  unit="laporan" />
            <CompactBoxData label="MAX" value={10} description="Jumlah laporan paling banyak yang dimiliki PIC"  unit="laporan" />
          </div>
        </div>
        
        {/* Reports Count Chart */}
        <div className="mt-10 rounded-2xl shadow p-4">
          <h1 className="mb-4 text-2xl">Report Count</h1>
          <Suspense fallback={<div className="w-full h-full relative"><LoadingAnimation /></div>}>
            <ReportCountChart />
          </Suspense>
        </div>

        {/* Ranking Table */}

        
      </div>
    </PrimeReactProvider>
  </>;
}