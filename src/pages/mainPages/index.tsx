import ReportForm from "./reportForm";
import ListDataReport from "./listDataReport";
import ApexChart from "./graphicChart";

import { Sidebar } from 'primereact/sidebar';
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { AccountType, type ReportData, type User } from "../../types/variables";

export default function MainPage() {
  const [setVisible, setIsVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData]: [User, Dispatch<SetStateAction<User>>] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    role: AccountType.Guru as AccountType,
    created_at: "",
  });
  const [reportData, setReportData] = useState([
    {
      id: "1",
      created_at: "2024-05-01",
      message: "Temuan kebocoran pipa di area workshop",
      location: "Workshop A",
      pic_name: "Suhaimi",
      type: "Safety",
      follow_up: "Guru",
      image: "/laporanNew.JPG",
      status: "NotStarted",
    },
    {
      id: "2",
      created_at: "2024-04-28",
      message: "Peralatan tidak tertata rapi setelah praktikum",
      location: "Lab Komputer",
      pic_name: "Heas Priyo",
      type: "5R",
      follow_up: "Siswa",
      image: "/laporanNew.JPG",
      status: "InProcess",
    },
    {
      id: "3",
      created_at: "2024-04-25",
      message: "Material bahan praktik tercecer di lantai",
      location: "Workshop B",
      pic_name: "Amalia",
      type: "5R",
      follow_up: "Siswa",
      image: "/laporanNew.JPG",
      status: "Complete",
    },
    {
      id: "4",
      created_at: "2024-04-20",
      message: "AC ruangan tidak berfungsi dengan baik",
      location: "Ruang Teori 3",
      pic_name: "Munir",
      type: "Safety",
      follow_up: "Vendor",
      image: "/laporanNew.JPG",
      status: "Hold",
    },
    {
      id: "5",
      created_at: "2024-04-20",
      message: "AC ruangan tidak berfungsi dengan baik",
      location: "Ruang Teori 8",
      pic_name: "Tya",
      type: "Abnormality",
      follow_up: "Vendor",
      image: "/laporanNew.JPG",
      status: "Complete",
    },
    {
      id: "6",
      created_at: "2024-05-20",
      message: "AC rusak",
      location: "Ruang Teori 4",
      pic_name: "Heas",
      type: "Abnormality",
      follow_up: "Vendor",
      image: "/laporanNew.JPG",
      status: "Complete",
    },
    {
      id: "6",
      created_at: "2024-06-20",
      message: "AC rusak",
      location: "Ruang Teori 4",
      pic_name: "Heas",
      type: "Safety",
      follow_up: "Vendor",
      image: "/laporanNew.JPG",
      status: "Complete",
    },
    {
      id: "6",
      created_at: "2024-06-20",
      message: "AC rusak",
      location: "Ruang Teori 4",
      pic_name: "Heas",
      type: "Safety",
      follow_up: "Vendor",
      image: "/laporanNew.JPG",
      status: "Complete",
    },
    {
      id: "6",
      created_at: "2024-07-20",
      message: "AC rusak",
      location: "Ruang Teori 4",
      pic_name: "Heas",
      type: "Abnormality",
      follow_up: "Vendor",
      image: "/laporanNew.JPG",
      status: "Complete",
    },
  ] as ReportData[])
  
  return <>

    {/* Desk Navbar */}
    <div className="mb-4 px-4 py-2 bg-white rounded-[50px] hidden md:flex flex-row items-center gap-6 mx-5">
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
      <div className="absolute  left-4 right-4 bottom-4">
        <button className="w-full justify-center rounded-[20px] flex px-3 py-0.5 text-white bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_6px_0_#E2DAD6] active:[box-shadow:0_2px_0_#E2DAD6] active:-translate-y-[5px]"
        >
          Logout
        </button>
      </div>
    </Sidebar>
    {/* End Sidebar Section for mobile */}

    {/* Content */}
    <div className="rounded-xl md:px-8 md:py-6 px-2 py-4 max-h-[35em] md:max-h-[40rem] relative overflow-y-scroll bg-white shadow-md shadow-gray-600">
      <div id="data-section" className={`tab-content ${activeTab == 0 ? "active" : "hidden"}`}>
        <ListDataReport userData={userData} reportData={reportData} setReportData={setReportData} />
      </div>
      <div id="form-section" className={`tab-content ${activeTab == 1 ? "active" : "hidden"} ${(userData.role == AccountType.Guru || userData.role == AccountType.Vendor) ? "" : "opacity-0"}`}>
        <ReportForm reportData={reportData} setReportData={setReportData} />
      </div>
      <div id="graph-section" className={`tab-content ${activeTab == 2 ? "active" : "hidden"} ${(userData.role == AccountType.Guru || userData.role == AccountType.Vendor) ? "" : "opacity-0"}`}>
        <ApexChart reportData={reportData} />
      </div>
    </div>
  </>
}
