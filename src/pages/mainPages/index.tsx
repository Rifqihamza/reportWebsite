import ReportForm from "./reportForm";
import ListDataReport from "./listDataReport";
import ApexChart from "./graphicChart";

import { getUser } from "../../utils/api_interface";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { AccountType, ReportStatus, ReportType, type Report, type Users } from "@prisma/client";

export default function MainPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData]: [Users, Dispatch<SetStateAction<Users>>] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    role: AccountType.Siswa as AccountType,
    created_at: new Date(),
  });

  
  const [reports, setReports]: [Report[], Dispatch<SetStateAction<Report[]>>] = useState([
    {
      id: "c1i241v13-5v4b62-v1tvdfsc",
      created_at: new Date(),
      message: "Temuan kebocoran pipa di area workshop",
      location: null as string | null,
      pic_name: "Suhaimi",
      type: ReportType.Abnormality as ReportType,
      follow_up: AccountType.Guru as AccountType,
      follow_up_name: "John Doe", // Add a placeholder name
      status: ReportStatus.Pending as ReportStatus,
      report_date: new Date(),
      due_date: new Date()
    },
  ]);
  
  
  useEffect(() => {
    getUser().then(user_data => {
      if(typeof user_data == "object") {
        setUserData(user_data);
      }
    })
  }, []);

  return <>
    {/* Tabs */}
    <div className="flex items-center">
      <button id="tab-data" onClick={() => setActiveTab(0)} className={`tab-button ${activeTab == 0 ? "active" : ""}`} data-tab="data">Report Data</button>
      <button id="tab-form" onClick={() => setActiveTab(1)} className={`tab-button ${activeTab == 1 ? "active" : ""} ${(userData.role == AccountType.Guru || userData.role == AccountType.Vendor) ? "" : "hidden"}`} data-tab="form">Report</button>
      <button id="tab-graph" onClick={() => setActiveTab(2)} className={`tab-button ${activeTab == 2 ? "active" : ""}`} data-tab="graph">Graphic Data</button>
    </div>

    {/* Content */}
    <div className="rounded-b-xl rounded-tr-xl px-4 py-4 max-h-[35rem] md:max-h-[40rem] relative overflow-y-scroll bg-white shadow-md shadow-gray-600">
      <div id="data-section" className={`tab-content ${activeTab == 0 ? "active" : "hidden"}`}>
        <ListDataReport userData={userData} reports={reports} setReports={setReports} />
      </div>
      <div id="form-section" className={`tab-content ${activeTab == 1 ? "active" : "hidden"} ${(userData.role == AccountType.Guru || userData.role == AccountType.Vendor) ? "" : "opacity-0"}`}>
        <ReportForm reportData={reports} setReportData={setReports} />
      </div>
      <div id="graph-section" className={`tab-content ${activeTab == 2 ? "active" : "hidden"} ${(userData.role == AccountType.Guru || userData.role == AccountType.Vendor) ? "" : "opacity-0"}`}>
        <ApexChart />
      </div>
    </div>
  </>
}
