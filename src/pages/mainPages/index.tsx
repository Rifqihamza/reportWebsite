import ReportForm from "./reportForm";
import ListDataReport from "./listDataReport";
import ApexChart from "./graphicChart";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { AccountType, type User } from "../../types/variables";

export default function MainPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData]: [User, Dispatch<SetStateAction<User>>] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    role: AccountType.Guru as AccountType,
    created_at: "",
  });

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
        <ListDataReport userData={userData} />
      </div>
      <div id="form-section" className={`tab-content ${activeTab == 1 ? "active" : "hidden"} ${(userData.role == AccountType.Guru || userData.role == AccountType.Vendor) ? "" : "opacity-0"}`}>
        <ReportForm />
      </div>
      <div id="graph-section" className={`tab-content ${activeTab == 2 ? "active" : "hidden"} ${(userData.role == AccountType.Guru || userData.role == AccountType.Vendor) ? "" : "opacity-0"}`}>
        <ApexChart />
      </div>
    </div>
  </>
}
