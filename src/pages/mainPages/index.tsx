import ReportForm from "./formReportPages";
import TableReportPages from "./tableReportPages";
import ApexChart from "./chartPages";
import OverlayBlockPages from "../../components/Overlay/BlockOverlayComponents";
import NavbarComponents from "../../components/Navbar/NavbarComponents";

import { AccountType, type ReportData, type User } from "../../types/variables";
import { getReport, getUser, userLogout } from "../../utils/api_interface";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

import { PrimeReactProvider } from "primereact/api";

export default function MainPage() {
  const [setVisible, setIsVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData]: [User | null, Dispatch<SetStateAction<User | null>>] = useState(null as User | null);
  const [reportData, setReportData]: [ReportData[], Dispatch<SetStateAction<ReportData[]>>] = useState([] as ReportData[]);


  async function handle_logout() {
    if (!userData || userData.role == AccountType.Siswa) {
      window.location.href = "/login";
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
      if (typeof user_data == "object") {
        setUserData(user_data);
      }
    })

    getReport().then(report_data_array => {
      if (typeof report_data_array == "object") {
        setReportData(report_data_array);
      }
    });
  }, []);
  return (
    <PrimeReactProvider>
      {/* Navbar */}
      <NavbarComponents activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <div className="rounded-xl md:px-8 md:py-6 px-2 py-4 max-h-[35rem] md:h-[38rem] lg:h-[38rem] relative overflow-y-scroll bg-white shadow-md shadow-gray-600">

        {/* Tab 0: Tabel Data */}
        <div id="data-section" className={`tab-content ${activeTab === 0 ? "active" : "hidden"}`}>
          <TableReportPages
            userData={userData}
            reportData={reportData}
            setReportData={setReportData}
          />
        </div>

        {userData && (userData.role === AccountType.Guru || userData.role === AccountType.Vendor) ? (
          <>
            {/* Report Form */}
            <div id="form-section" className={`tab-content ${activeTab == 1 ? "active" : "hidden"}`}>
              <ReportForm reportData={reportData} setReportData={setReportData} />
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
  );
}
