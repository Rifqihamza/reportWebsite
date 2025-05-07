import ReportForm from "./reportForm";
import ListDataReport from "./listDataReport";
import ApexChart from "./graphicChart";

import { AccountType, ReportStatus, ReportType, type ReportData, type User } from "../../types/variables";
import { getUser } from "../../utils/api_interface";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

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

  
  const [reports, setReports]: [ReportData[], Dispatch<SetStateAction<ReportData[]>>] = useState([
    {
      id: "",
      created_at: new Date().toISOString(),
      message: "",
      location: "",
      pic_name: "",
      follow_up_name: "",
      type: ReportType.Abnormality as ReportType,
      follow_up: AccountType.Guru as AccountType,
      status: ReportStatus.Pending as ReportStatus,
      report_date: new Date().toISOString(),
      due_date: new Date().toISOString()
    } as ReportData,
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
