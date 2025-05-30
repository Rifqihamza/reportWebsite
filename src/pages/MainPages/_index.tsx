import NavbarComponents from "../../components/Navbar/NavbarComponent";

import { AccountType, type ReportData, type User } from "../../types/variables";
import { getReport, getUser, userLogout } from "../../utils/api_interface";
import { useEffect, useState } from "react";

import { PrimeReactProvider } from "primereact/api";

import ReportForm from "./_FormReportPage";
import FooterComponent from "../../components/Footer/FooterComponent";

export default function MainPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState<User | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);

  async function handle_logout() {
    if (userData && !(await userLogout())) {
      alert("Terjadi error saat ingin logout!");
      return;
    }

    window.location.href = "/loginPage";
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
    <>
      <PrimeReactProvider>
        {/* Navbar */}
        < NavbarComponents handle_logout={handle_logout} userData={userData} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="max-w-7xl mx-auto p-4 m-4 relative rounded-4xl w-full">
          {/* Tab 0: Form, bebas diakses */}
          {activeTab === 0 && (<>
            <ReportForm reportData={reportData} setReportData={setReportData} isAuthorized={isAuthorized ? true : false} />
          </>
          )}
        </div>
        <FooterComponent />
      </PrimeReactProvider>
    </>
  );
}
