import { useState } from "react";
import NavbarDashboard from "../../../components/DashboardComponents/NavbarDashboard/NavbarDashboard";
import GraphicPage from "./GraphicPage";
import { type ReportData, type User } from "../../../types/variables";
import TablePage from "./TablePage";
import WelcomePage from "./WelcomePage";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [showSidebar, setShowSidebar] = useState(true);
    const [userData, setUserData] = useState<User | null>(null);

    return (
        <div className="flex flex-col h-screen p-4">
            {/* Top Navbar */}
            <div className="bg-white rounded-2xl shadow z-10 flex justify-between items-center px-4 py-1 sticky top-0">
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="p-2"
                >
                    <i className="pi pi-bars text-xl!"></i>
                </button>
                <div>
                    <img src="/img/logoSekolah.png" className="w-7 h-auto ring-2 ring-white rounded-full" alt="" />
                </div>
            </div>

            {/* Main Area: Sidebar + Scrollable Content */}
            <div className="flex overflow-auto gap-4 py-4 h-screen">
                {/* Sidebar */}
                <NavbarDashboard
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                />

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 0 && <WelcomePage />}
                    {activeTab === 1 && (
                        <TablePage
                            userData={userData}
                            reportData={reportData}
                            setReportData={setReportData}
                        />
                    )}
                    {activeTab === 2 && <GraphicPage reportData={reportData} />}
                </div>
            </div>
        </div>
    );
}

