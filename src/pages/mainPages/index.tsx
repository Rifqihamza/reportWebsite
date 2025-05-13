import ReportForm from "./formReportPages";
import TableReportPages from "./tableReportPages";
import ApexChart from "./chartPages";
import OverlayBlockPages from "../../components/Overlay/BlockOverlayComponents";
import NavbarComponents from "../../components/Navbar/NavbarComponents";

import { useState, type Dispatch, type SetStateAction } from "react";
import { AccountType, type ReportData, type User } from "../../types/variables";
import { tableDataReport } from "../../types/tableDataReport";
import { PrimeReactProvider } from "primereact/api";

export default function MainPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData]: [User, Dispatch<SetStateAction<User>>] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    role: AccountType.Siswa as AccountType,
    created_at: "",
  });

  const [reportData, setReportData] = useState<ReportData[]>(tableDataReport);

  return <PrimeReactProvider>

    {/* Navbar */}
    <NavbarComponents activeTab={activeTab} setActiveTab={setActiveTab} />

    {/* Content */}
    <div className="rounded-xl md:px-8 md:py-6 px-2 py-4 max-h-[35rem] md:h-[38rem] lg:h-[38rem] relative overflow-y-scroll bg-white shadow-md shadow-gray-600">

      {/* Table Data Report */}
      <div id="data-section" className={`tab-content ${activeTab == 0 ? "active" : "hidden"}`}>
        <TableReportPages
          userData={userData}
          reportData={reportData}
          setReportData={setReportData} />
      </div>

      {(userData.role === AccountType.Guru || userData.role === AccountType.Vendor) ? (
        <>
          {/* Report Form */}
          <div id="form-section" className={`tab-content ${activeTab == 1 ? "active" : "hidden"}`}>
            <ReportForm />
          </div>

          {/* Chart Data Report */}
          <div id="graph-section" className={`tab-content ${activeTab === 2 ? "active" : "hidden"}`}>
            <ApexChart reportData={reportData} />
          </div>
        </>
      ) : (
        <OverlayBlockPages />
      )}

    </div>
  </PrimeReactProvider>
}
