import ReportForm from "./formReportPages";
import TableReportPages from "./tableReportPages";
import ApexChart from "./chartPages";
import OverlayBlockPages from "../../components/Overlay/BlockOverlayComponents";
import NavbarComponents from "../../components/Navbar/NavbarComponents";

import { AccountType, type ReportData, type User } from "../../types/variables";
import { getReport, getUser, userLogout } from "../../utils/api_interface";
import { useEffect, useState } from "react";

import { PrimeReactProvider } from "primereact/api";
import LogoutButton from "../../components/LogoutButton/LogoutButtonComponents";

export default function MainPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState<User | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);

  async function handle_logout() {
    if (!userData || userData.role === AccountType.Siswa) {
      window.location.href = "/loginPages";
      return;
    }

    if (!(await userLogout())) {
      alert("Terjadi error saat ingin logout!");
      return;
    }

    window.location.reload();
  }

  useEffect(() => {
    getUser().then(user_data => {
      if (typeof user_data === "object") {
        setUserData(user_data);
      }
    });

    getReport().then(report_data_array => {
      if (typeof report_data_array === "object") {
        setReportData(report_data_array);
      }
    });
  }, []);

  const isAuthorized =
    userData && (userData.role === AccountType.Guru || userData.role === AccountType.Vendor);

  return (
    <PrimeReactProvider>
      <LogoutButton handle_logout={handle_logout} userData={userData} />

      {/* Navbar */}
      <NavbarComponents activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <div className="rounded-xl md:px-8 md:py-6 px-2 py-4 max-h-[35rem] md:h-[38rem] lg:h-[38rem] relative overflow-y-scroll bg-white shadow-md shadow-gray-600">

        {/* Tab 0: Table, bebas diakses */}
        {activeTab === 0 && (
          <TableReportPages
            userData={userData}
            reportData={reportData}
            setReportData={setReportData}
          />
        )}

        {/* Tab 1: Form Report */}
        {activeTab === 1 && (
          isAuthorized ? (
            <ReportForm reportData={reportData} setReportData={setReportData} />
          ) : (
            <OverlayBlockPages />
          )
        )}

        {/* Tab 2: Chart */}
        {activeTab === 2 && (
          isAuthorized ? (
            <ApexChart reportData={reportData} />
          ) : (
            <OverlayBlockPages />
          )
        )}
      </div>
    </PrimeReactProvider>
  );
}
