import { useEffect } from "react";
import NavbarDashboard from "../../../components/DashboardComponents/NavbarDashboard/NavbarDashboard";
import TablePage from "./_TablePage";
import WelcomePage from "./_WelcomePage";
import GraphicPage from "./_GraphicPage";
import SettingPage from "./_SettingPage";
import UseUserDataHookEffect, { useUserDataHook } from "../../../hooks/shared/useUserData";
import { AccountType } from "../../../types/variables";
import UseReportConfigHookEffect from "../../../hooks/useReportConfig";
import { PrimeReactProvider } from "primereact/api";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import ConfigurationPage from "./_ConfigurationPage";

export default function DashboardPage() {
    const { userData } = useUserDataHook();
    const { setShowSidebar, activeTab, showSidebar } = useDashboardNavbarHook();


    useEffect(() => {
        if (userData) {
            if (userData?.role !== AccountType.Guru && userData?.role !== AccountType.Vendor) {
                window.location.href = "/";
            }
        }
    }, [userData]);

    return (
        <>
            <UseUserDataHookEffect />
            <UseReportConfigHookEffect useAll />
            <PrimeReactProvider>
                <div className="flex flex-col h-screen p-4 border 2">
                    {/* Top Navbar */}
                    <div className="bg-white rounded-2xl shadow shadow-gray-500 z-10 flex justify-between items-center px-4 py-1 sticky top-0">
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="p-4 flex items-center gap-4 font-semibold lg:hidden"
                        >
                            <i className="pi pi-bars"></i>
                            E-Lapor Dashboard
                        </button>
                        <div>
                            <img src="/img/logoSekolah.png" className="w-10 h-auto ring-2 ring-white rounded-full" alt="" />
                        </div>
                    </div>

                    {/* Main Area: Sidebar + Scrollable Content */}
                    <div className="flex gap-4 py-4 px-1 h-full overflow-y-auto">
                        {/* Sidebar */}
                        <NavbarDashboard />

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-2 ">
                            {activeTab === 0 && <WelcomePage />}
                            {activeTab === 1 && <TablePage />}
                            {activeTab === 2 && <GraphicPage />}
                            {activeTab === 3 && <SettingPage />}
                            {activeTab === 4 && <ConfigurationPage />}
                            {activeTab === 5 && <SettingPage />}
                        </div>
                    </div>
                </div>
            </PrimeReactProvider>
        </>
    );
}

