import OverlayBlockPages from "../../components/Overlay/BlockOverlayComponent";
import NavbarComponents from "../../components/Navbar/NavbarComponent";

import { AccountType, type ReportData, type User } from "../../types/variables";
import { getReport, getUser, userLogout } from "../../utils/api_interface";
import React, { Suspense, useEffect, useState } from "react";

import { PrimeReactProvider } from "primereact/api";

import ReportForm from "./_FormReportPage";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import FooterComponent from "../../components/Footer/FooterComponent";
import { useUserData } from "../../hooks/useUserData";
import { useReportData } from "../../hooks/useReportData";
import { useIsAuthorized } from "../../hooks/useIsAuthorized";
const TableReportPages = React.lazy(() => import("./_TableReportPage"));
const ApexChart = React.lazy(() => import("./_ChartPage"));

export default function MainPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { userData, setUserData } = useUserData();
  const { setReportData } = useReportData();
  const { isAuthorized, setIsAuthorized } = useIsAuthorized();

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

  useEffect(() => {
    if(userData?.role === AccountType.Guru || userData?.role === AccountType.Vendor) {
      setActiveTab(1);
    }

    setIsAuthorized(userData && (userData.role === AccountType.Guru || userData.role === AccountType.Vendor));
  }, [userData]);


  return (
    <>
      <PrimeReactProvider>
        {/* Navbar */}
        <NavbarComponents activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="max-w-7xl mx-auto p-4 m-4 relative rounded-4xl w-full  overflow-y-scroll">
          {/* Tab 0: Form, bebas diakses */}
          {activeTab === 0 && (<>
            <ReportForm />
          </>
          )}

          {/* Tab 1: Table */}
          {activeTab === 1 && (
            isAuthorized ? (
              <Suspense fallback={<LoadingAnimation />}>
                <TableReportPages />
              </Suspense>
            ) : (
              <OverlayBlockPages />
            )
          )}

          {/* Tab 2: Chart */}
          {activeTab === 2 && (
            isAuthorized ? (
              <Suspense fallback={<LoadingAnimation />}>
                <ApexChart />
              </Suspense>
            ) : (
              <OverlayBlockPages />
            )
          )}
        </div>

        <FooterComponent />
      </PrimeReactProvider>
    </>
  );
}
