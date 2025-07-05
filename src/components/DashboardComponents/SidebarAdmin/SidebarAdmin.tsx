import { useEffect, useState } from "react";
import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { userLogout } from "../../../utils/api_interface";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import { useNetworkConnectivityHook } from "../../../hooks/shared/useNetworkConnectivity";
import { PrimeReactProvider } from "primereact/api";

export default function SidebarDashboard() {

    const [shouldRender, setShouldRender] = useState(false)
    const { showSidebar, setShowSidebar, activeTab, setActiveTab } = useDashboardNavbarHook();

    useEffect(() => {
        if (!showSidebar) {
            setTimeout(() => {
                setShouldRender(true);
            }, 300);
        }
        else {
            setShouldRender(false);
        }
    }, [showSidebar]);

    useEffect(() => {
        setShowSidebar(false);
    }, [activeTab]);

    const { userData } = useUserDataHook();
    const { isConnected } = useNetworkConnectivityHook();

    async function handle_logout() {
        if(!isConnected) return;
        
        if (userData && !(await userLogout())) {
            alert("Terjadi error saat ingin logout!");
            return;
        }
        confirm("Apakah Anda yakin ingin keluar?") &&
            (window.location.href = "/loginPage");
    }

    return (
        <div
            className={`lg:relative lg:h-full h-[80vh] w-[calc(100vw_-_(var(--spacing)_*_8))] fixed bg-white shadow-md shadow-gray-400 rounded-2xl duration-300 z-20 lg:w-[18rem] lg:opacity-100 lg:translate-x-0 lg:left-0 ${showSidebar ? "-translate-x-1/2 left-1/2" : "w-0 opacity-0 -translate-x-full" + (shouldRender ? "" : "")} `}>
            <div
                className={`flex flex-col gap-2 h-full p-6 transform transition-all duration-300 ease-in-out whitespace-nowrap opacity-100 translate-x-0"
                    }`}
            >
                <ul className="relative h-full space-y-2">
                    <li>
                        <button
                            onClick={() => setActiveTab(0)}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 0 ? "text-[#1f324d]" : "text-black/50"
                                }`}
                        >
                            <i className="pi pi-home"></i>
                            Home
                            <span
                                className={`absolute bottom-0 left-0 h-1 bg-[#1f324d] rounded-full transition-all duration-500 ${activeTab === 0 ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                    }`}
                            ></span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab(1)}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 1 ? "text-[#1f324d]" : "text-black/50"
                                }`}
                        >
                            <i className="pi pi-clipboard"></i>
                            Table Report
                            <span
                                className={`absolute bottom-0 left-0 h-1 bg-[#1f324d] rounded-full transition-all duration-500 ${activeTab === 1 ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                    }`}
                            ></span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab(2)}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 2 ? "text-[#1f324d]" : "text-black/50"
                                }`}
                        >
                            <i className="pi pi-chart-bar"></i>
                            Statistics
                            <span
                                className={`absolute bottom-0 left-0 h-1 bg-[#1f324d] rounded-full transition-all duration-500 ${activeTab === 2 ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                    }`}
                            ></span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab(3)}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 3 ? "text-[#1f324d]" : "text-black/50"
                                }`}
                        >
                            <i className="pi pi-file-export"></i>
                            Export
                            <span
                                className={`absolute bottom-0 left-0 h-1 bg-[#1f324d] rounded-full transition-all duration-500 ${activeTab === 3 ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                    }`}
                            ></span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab(4)}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 4 ? "text-[#1f324d]" : "text-black/50"
                                }`}
                        >
                            <i className="pi pi-user"></i>
                            Users
                            <span
                                className={`absolute bottom-0 left-0 h-1 bg-[#1f324d] rounded-full transition-all duration-500 ${activeTab === 4 ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                    }`}
                            ></span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab(5)}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 5 ? "text-[#1f324d]" : "text-black/50"
                                }`}
                        >
                            <i className="pi pi-cog"></i>
                            Setting
                            <span
                                className={`absolute bottom-0 left-0 h-1 bg-[#1f324d] rounded-full transition-all duration-500 ${activeTab === 5 ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                    }`}
                            ></span>
                        </button>
                    </li>
                </ul>
                <button
                    onClick={() => window.location.href = "/form"}
                    className={`flex flex-row items-center justify-center gap-3 w-full font-semibold uppercase tracking-wider text-white bg-[#1f324d] px-4 py-2 rounded-lg hover:bg-[#7FA1C3] hover:brightness-120 duration-300 cursor-pointer`}
                >
                    <i className="pi pi-search"></i>
                    Report a finding!
                </button>
                <button
                    onClick={() => handle_logout()}
                    className="flex flex-row items-center justify-center gap-3 w-full font-semibold uppercase tracking-wider text-white bg-[#1f324d] px-4 py-2 rounded-lg hover:bg-[#7FA1C3] duration-300 cursor-pointer"
                >
                    <i className="pi pi-sign-out"></i>
                    Logout
                </button>
            </div>
        </div>
    );
}
