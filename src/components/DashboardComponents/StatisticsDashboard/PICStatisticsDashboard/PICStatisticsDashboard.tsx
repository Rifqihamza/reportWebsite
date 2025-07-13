import { PrimeReactProvider } from "primereact/api";
import { useDashboardNavbarHook } from "../../../../hooks/shared/useDashboardNavbar";
import ReportCountChart from "./outputs/ReportCountChart";
import CompactBoxData from "./outputs/CompactBoxData";


export default function PICStatisticsDashboard() {
  const { activeTab } = useDashboardNavbarHook();

  if(activeTab !== 6) {
      return <></>;
  }

  return <>
    <PrimeReactProvider>
      <div className='flex flex-col gap-4 mx-4 mt-2'>
        <h1 className="text-3xl">PIC Statistics</h1>

        {/* Box Data */}
        <div className="flex flex-col md:flex-row gap-2">
          <CompactBoxData label="MIN" value={0} description="Jumlah laporan paling sedikit yang dimiliki PIC" unit="laporan" />
          <CompactBoxData label="AVG" value={5} description="Rata-rata jumlah laporan yang dimiliki PIC"  unit="laporan" />
          <CompactBoxData label="MAX" value={10} description="Jumlah laporan paling banyak yang dimiliki PIC"  unit="laporan" />
        </div>
        
        {/* Reports Count Chart */}
        <h1 className="mt-4 text-xl">Report Count</h1>
        <ReportCountChart />

        {/* Ranking Table */}

        
      </div>
    </PrimeReactProvider>
  </>;
}