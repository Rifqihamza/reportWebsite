import { useState } from "react";
import NavbarDashboard from "../../../components/DashboardComponents/NavbarDashboard/NavbarDashboard";
import GraphicPage from "./GraphicPage";
import { type ReportData, type User } from "../../../types/variables";
import TablePage from "./TablePage";
import WelcomePage from "./WelcomePage";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);
    return (
        <div className="flex gap-4 p-4 h-screen max-h-screen">
            {/* Sidebar */}
            <NavbarDashboard
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
            />

            {/* Main Area */}
            <div className="flex flex-col overflow-y-auto w-full gap-4">

                {/* Top Navbar */}
                <div className="bg-black/10 rounded-2xl backdrop-blur-md shadow z-10 flex justify-between items-center px-4 py-2">
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="p-2 text-white"
                    >
                        <i className="pi pi-bars text-xl!"></i>
                    </button>
                    <div>
                        <div>
                            <img src="/public/img/logoSekolah.png" className="w-8 h-auto ring-2 ring-white rounded-full" alt="" />
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 0 && <WelcomePage />}
                    {activeTab === 1 && <TablePage userData={userData} reportData={reportData} setReportData={setReportData} />}
                    {activeTab === 2 && <GraphicPage reportData={reportData} />}
                </div>
            </div>
        </div>
    );
}
