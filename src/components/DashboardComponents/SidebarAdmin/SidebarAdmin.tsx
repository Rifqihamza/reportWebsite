import { useEffect, useState } from "react";
import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { userLogout } from "../../../utils/api_interface";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import { useNetworkConnectivityHook } from "../../../hooks/shared/useNetworkConnectivity";
import { menuItems, type MenuItem } from "../../../types/variables";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";


export default function SidebarDashboard() {
    const { showSidebar, setShowSidebar, activeTab, setActiveTab } = useDashboardNavbarHook();
    const { userData, userPrivillages } = useUserDataHook();
    const { isConnected } = useNetworkConnectivityHook();
    const { showMessage } = useMessageToastHook();

    useEffect(() => {
        setShowSidebar(false);
    }, [activeTab]);

    const handleLogout = async () => {
        if (!isConnected) return;

        if (userData && !(await userLogout())) {
            showMessage("Terjadi error saat ingin logout!", "error", "");
            return;
        }

        if (confirm("Apakah Anda yakin ingin keluar?")) {
            window.location.href = "/loginPage";
        }
    };

    const renderMenuItem = ({ id, label, icon, privillage }: MenuItem) => {
        if(privillage && !userPrivillages.includes(privillage)) {
            return "";
        }
        
        return (
            <li key={id}>
                <button
                    onClick={() => setActiveTab(id)}
                    className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === id ? "text-white" : "text-gray-300"
                        }`}
                >
                    <i className={icon}></i>
                    {label}
                    <span
                        className={`absolute bottom-0 left-0 h-1 bg-white rounded-full transition-all duration-500 ${activeTab === id ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                            }`}
                    ></span>
                </button>
            </li>
        );
    };

    return (
        <div
            className={`lg:relative lg:w-[14rem] lg:translate-x-0 h-full w-full fixed left-0 bg-[#1f324d] duration-500 z-20
                ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex flex-col gap-2 h-full px-4 transform transition-all duration-300 ease-in-out whitespace-nowrap opacity-100 translate-x-0">
                <ul className="relative h-full space-y-2">
                    {menuItems.map(renderMenuItem)}

                    <li>
                        <button
                            onClick={() => (window.location.href = "/form")}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 text-gray-300`}
                        >
                            <i className="pi pi-search"></i>
                            Report Page
                            <i className="ml-4 pi pi-external-link text-xs! opacity-50"></i>
                            <span className="absolute bottom-0 left-0 h-1 bg-white rounded-full transition-all duration-500 w-0 group-hover:w-full group-hover:left-0"></span>
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={handleLogout}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 text-gray-300`}
                        >
                            <i className="pi pi-sign-out"></i>
                            Logout
                            <span className="absolute bottom-0 left-0 h-1 bg-white rounded-full transition-all duration-500 w-0 group-hover:w-full group-hover:left-0"></span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}