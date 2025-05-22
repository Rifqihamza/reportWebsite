import OverlayBlockPages from "../../components/Overlay/BlockOverlayComponent";
import NavbarComponents from "../../components/Navbar/NavbarComponent";

import { AccountType, type ReportData, type User } from "../../types/variables";
import { getReport, getUser, userLogout } from "../../utils/api_interface";
import React, { Suspense, useEffect, useState } from "react";

import { PrimeReactProvider } from "primereact/api";
import LogoutButton from "../../components/LogoutButton/LogoutButtonComponent";

import ReportForm from "./_FormReportPage";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
const TableReportPages = React.lazy(() => import("./_TableReportPage"));
const ApexChart = React.lazy(() => import("./_ChartPage"));

export default function MainPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState<User | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);

  async function handle_logout() {
    if (!userData || userData.role === AccountType.Siswa) {
      window.location.href = "/loginPage";
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
      <NavbarComponents handle_logout={handle_logout} userData={userData} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <div className="rounded-xl md:px-8 md:py-6 px-2 py-4 relative w-full max-w-[95vw] h-fit max-h-[80vh] overflow-y-scroll bg-white shadow-md shadow-gray-600">

        {/* Tab 0: Form, bebas diakses */}
        {activeTab === 0 && (<>
          <ReportForm reportData={reportData} setReportData={setReportData} />
        </>
        )}

        {/* Tab 1: Table */}
        {activeTab === 1 && (
          isAuthorized ? (
            <Suspense fallback={<LoadingAnimation />}>
              <TableReportPages
                userData={userData}
                reportData={reportData}
                setReportData={setReportData}
              />
            </Suspense>
          ) : (
            <OverlayBlockPages />
          )
        )}

        {/* Tab 2: Chart */}
        {activeTab === 2 && (
          isAuthorized ? (
            <Suspense fallback={<LoadingAnimation />}>
              <ApexChart reportData={reportData} />
            </Suspense>
          ) : (
            <OverlayBlockPages />
          )
        )}
      </div>
    </PrimeReactProvider>
  );
}
