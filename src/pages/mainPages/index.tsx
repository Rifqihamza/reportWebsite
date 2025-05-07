import ReportForm from "./reportForm";
import ListDataReport from "./listDataReport";
import ApexChart from "./graphicChart";

import { Sidebar } from 'primereact/sidebar';
import { AccountType, ReportStatus, ReportType, type ReportData, type User } from "../../types/variables";
import { getUser } from "../../utils/api_interface";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export default function MainPage() {
  const [setVisible, setIsVisible] = useState<boolean>(false);
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
      status: ReportStatus.Hold as ReportStatus,
      report_date: new Date().toISOString(),
      due_date: new Date().toISOString(),
      image: ""
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

    {/* Desk Navbar */}
    <div className="mb-4 px-3 py-2 bg-white rounded-[50px] hidden md:flex flex-row items-center gap-6 mx-5">
      <button
        onClick={() => setActiveTab(0)}
        className={`tab-button ${activeTab === 0 ? "active" : ""}`}
      >
        Report Data
      </button>
      {(userData.role === AccountType.Guru || userData.role === AccountType.Vendor) && (
        <button
          onClick={() => setActiveTab(1)}
          className={`tab-button ${activeTab === 1 ? "active" : ""}`}
        >
          Report
        </button>
      )}
      <button
        onClick={() => setActiveTab(2)}
        className={`tab-button ${activeTab === 2 ? "active" : ""}`}
      >
        Graphic
      </button>
    </div>

    {/* SideBar Section for Mobile */}
    <div className="md:hidden flex flex-row items-center justify-between px-6 py-2 bg-white rounded-[40px] mb-4">
      <button onClick={() => { setIsVisible(true) }}>
        <img src="/sidebarIcon.svg" alt="" className="w-5 h-auto" />
      </button>
      <img src="/logoSekolah.png" alt="" className="w-9 h-auto" />
    </div>

    <Sidebar className=" bg-white px-6 py-1 rounded-r-4xl" showCloseIcon={false} position="left" visible={setVisible} onHide={() => setIsVisible(false)}>
      {/* Close Button */}
      <div className="relative py-2 mb-10 w-full">
        <button className="absolute top-4 right-0" onClick={() => { setIsVisible(false) }}>
          <img src="/closeIcon.svg" alt="" className="w-6 h-auto" />
        </button>
      </div>

      <button
        onClick={() => {
          setActiveTab(0);
          setIsVisible(false);
        }}
        className={`side-button ${activeTab === 0 ? "active" : ""}`}
      >
        Report Data
      </button>
      {(userData.role === AccountType.Guru || userData.role === AccountType.Vendor) && (
        <button
          onClick={() => {
            setActiveTab(1);
            setIsVisible(false);
          }} className={`side-button ${activeTab === 1 ? "active" : ""}`}
        >
          Report
        </button>
      )}
      <button
        onClick={() => {
          setActiveTab(2);
          setIsVisible(false);
        }} className={`side-button ${activeTab === 2 ? "active" : ""}`}
      >
        Graphic Data
      </button>
    </Sidebar>
    {/* End Sidebar Section for mobile */}

    {/* Content */}
    <div className="rounded-xl px-4 py-4 max-h-[35rem] md:max-h-[40rem] relative overflow-y-scroll bg-white shadow-md shadow-gray-600">
      <div id="data-section" className={`tab-content ${activeTab == 0 ? "active" : "hidden"}`}>
      </div>
        <ListDataReport userData={userData} reports={reports} setReports={setReports} />
      <div id="form-section" className={`tab-content ${activeTab == 1 ? "active" : "hidden"} ${(userData.role == AccountType.Guru || userData.role == AccountType.Vendor) ? "" : "opacity-0"}`}>
        <ReportForm reportData={reports} setReportData={setReports} />
      </div>
      <div id="graph-section" className={`tab-content ${activeTab == 2 ? "active" : "hidden"} ${(userData.role == AccountType.Guru || userData.role == AccountType.Vendor) ? "" : "opacity-0"}`}>
        <ApexChart reportData={reports} />
      </div>
    </div>
  </>
}
