import { useEffect, useState } from "react";
import NavbarDashboard from "../../../DashboardComponents/NavbarDashboard/NavbarDashboard";
import TablePage from "./_TablePage";
import WelcomePage from "./_WelcomePage";
import GraphicPage from "./_GraphicPage";
import SettingPage from "./_SettingPage";
import { getReport, getUser } from "../../../utils/api_interface";
import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { useReportDataHook } from "../../../hooks/shared/useReportData";
import { AccountType } from "../../../types/variables";
import UseReportConfigHookEffect from "../../../hooks/useReportConfig";
import { PrimeReactProvider } from "primereact/api";
export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [showSidebar, setShowSidebar] = useState(true);
    const { userData, setUserData } = useUserDataHook();
    const { setReportData } = useReportDataHook();

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

    useEffect(() => {
        if (userData) {
            if (userData?.role !== AccountType.Guru && userData?.role !== AccountType.Vendor) {
                window.location.href = "/";
            }
        }
    }, [userData]);

    return (
        <>
            <UseReportConfigHookEffect useAll />
            <PrimeReactProvider>
                <div className="flex flex-col h-screen p-4 border 2">
                    {/* Top Navbar */}
                    <div className="bg-white rounded-2xl shadow shadow-gray-500 z-10 flex justify-between items-center px-4 py-1 sticky top-0">
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="p-2 flex items-center gap-4 font-semibold"
                        >
                            <i className="pi pi-bars"></i>
                            E-Lapor Dashboard
                        </button>
                        <div>
                            <img src="/img/logoSekolah.png" className="w-7 h-auto ring-2 ring-white rounded-full" alt="" />
                        </div>
                    </div>

                    {/* Main Area: Sidebar + Scrollable Content */}
                    <div className="flex gap-4 py-4 px-1 h-full overflow-y-auto">
                        {/* Sidebar */}
                        <NavbarDashboard
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            showSidebar={showSidebar}
                            setShowSidebar={setShowSidebar}
                        />

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-2 ">
                            {activeTab === 0 && <WelcomePage />}
                            {activeTab === 1 && <TablePage />}
                            {activeTab === 2 && <GraphicPage />}
                            {activeTab === 5 && <SettingPage />}
                        </div>
                    </div>
                </div>
            </PrimeReactProvider>
        </>
    );
}

