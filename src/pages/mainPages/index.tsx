import ReportForm from "./reportForm";
import ListDataReport from "./listDataReport";
import ApexChart from "./graphicChart";

import { Sidebar } from 'primereact/sidebar';
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { AccountType, type User } from "../../types/variables";

import MenuIcon from '@mui/icons-material/Menu';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReportIcon from "@mui/icons-material/Report";

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
    <div className="md:hidden flex flex-row items-center justify-between px-6 py-2 bg-white rounded-xl mb-4">
      <button onClick={() => { setIsVisible(true) }}>
        <MenuIcon />
      </button>
      <img src="/img/logoSekolah.png" alt="" className="w-9 h-auto" />
    </div>

    <Sidebar className="bg-white px-2 py-1 rounded-r-4xl" showCloseIcon={true} position="left" visible={setVisible} onHide={() => setIsVisible(false)}>
      {/* End Sidebar Section for Mobile */}
      <div className="flex flex-col items-start justify-center w-full gap-2">
        <button
          onClick={() => {
            setActiveTab(0);
            setIsVisible(false);
          }}
          className={`w-full text-left px-4 py-2 rounded-lg flex flex-row items-center gap-2 ${activeTab === 0 ? "bg-[#7FA1C3] text-white" : "hover:bg-gray-300 duration-300"}`}
        >
          <AssignmentIcon />
          Report Data
        </button>

        {(userData.role === AccountType.Guru || userData.role === AccountType.Vendor) && (
          <button
            onClick={() => {
              setActiveTab(1);
              setIsVisible(false);
            }} className={`w-full text-left px-4 py-2 rounded-lg flex flex-row items-center gap-2 ${activeTab === 1 ? "bg-[#7FA1C3] text-white" : "hover:bg-gray-300 duration-300"}`}
          >
            <ReportIcon fontSize="medium" />
            Report
          </button>
        )}

        <button
          onClick={() => {
            setActiveTab(2);
            setIsVisible(false);
          }} className={`w-full text-left px-4 py-2 rounded-lg flex flex-row items-center gap-2 ${activeTab === 2 ? "bg-[#7FA1C3] text-white" : "hover:bg-gray-300 duration-300"}`}
        >
          <BarChartIcon fontSize="medium" />
          Graphic Data
        </button>
      </div>
      <div className="absolute  left-4 right-4 bottom-4">
        <button className="w-full justify-center md:hidden block px-4 py-2 text-white rounded-xl bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300"
        >
          Logout
        </button>
      </div>
    </Sidebar>
    {/* End Sidebar Section for mobile */}

    {/* Content */}
    <div className="rounded-xl md:px-8 md:py-6 px-2 py-4 max-h-[35em] md:max-h-[38rem] relative overflow-y-scroll bg-white shadow-md shadow-gray-600">
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
