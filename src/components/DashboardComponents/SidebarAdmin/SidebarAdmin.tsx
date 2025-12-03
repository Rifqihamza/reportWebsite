import { useEffect, useState } from "react";
import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { userLogout } from "../../../utils/api_interface";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import { useNetworkConnectivityHook } from "../../../hooks/shared/useNetworkConnectivity";
import { menuItems, type MenuItem, type MenuItemGroup } from "../../../types/variables";


export default function SidebarDashboard() {
    const { showSidebar, setShowSidebar, activeTab, setActiveTab } = useDashboardNavbarHook();
    const { userData, userPrivillages } = useUserDataHook();
    const { isConnected } = useNetworkConnectivityHook();

    const [openedMenuTab, setOpenedMenuTab] = useState<{ id: number, isOpen: boolean }[]>(menuItems.map((item, index) => ({ id: index, isFiltered: (item as any).items !== undefined })).filter((item) => item.isFiltered).map((item) => ({ id: item.id, isOpen: false })));

    useEffect(() => {
        setShowSidebar(false);
    }, [activeTab]);

    const handleLogout = async () => {
        if (!isConnected || !confirm("Apakah Anda yakin ingin keluar?")) return;

        if (userData && !(await userLogout())) {
            alert("Terjadi error saat ingin logout!");
            return;
        }

        window.location.href = "/loginPage";

    };

    const renderMenuItem = (menu: MenuItem | MenuItemGroup, index: number) => {
        if ((menu as any).items) {
            menu = menu as MenuItemGroup;

            if (menu.items.every((item) => item.privillage && !userPrivillages.includes(item.privillage))) {
                return ""
            }

            const isActive = menu.items.some((item) => activeTab === item.id);
            const isGroupOpened = (openedMenuTab.find((item) => item.id === index)?.isOpen);

            return <li key={index}>
                <div className="">
                    <button
                        onClick={() => setOpenedMenuTab(openedMenuTab.map((item) => item.id === index ? { id: item.id, isOpen: !item.isOpen } : item))}
                        className={`relative w-full flex flex-row items-center text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${isActive ? "text-white" : "text-gray-300"
                            }`}
                    >
                        <i className={menu.icon}></i>
                        <div className="w-full flex flex-row justify-between">
                            <span>{menu.label}</span>
                            <i data-is-open={isGroupOpened} className="pi pi-angle-down duration-500 origin-[50%_30%] scale-y-100 data-[is-open=true]:-scale-y-100"></i>
                        </div>
                        <span
                            className={`absolute bottom-0 left-0 h-1 bg-white rounded-full transition-all duration-500 ${isGroupOpened ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                }`}
                        ></span>
                    </button>
                    <div data-is-open={isGroupOpened} className="overflow-hidden flex flex-col gap-1 bg-transparent text-white duration-500 h-28 p-2 data-[is-open=false]:h-0! data-[is-open=false]:p-0">
                        {
                            menu.items.map((item, index) => {
                                return <button
                                    key={index}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`p-3 relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === item.id ? "text-white bg-black/50" : "text-gray-300"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            })
                        }
                    </div>
                </div>
            </li>
        }
        else {
            menu = menu as MenuItem;

            if (menu.privillage && !userPrivillages.includes(menu.privillage)) {
                return "";
            }


            return (
                <li key={index}>
                    <button
                        onClick={() => setActiveTab((menu as MenuItem).id)}
                        className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === menu.id ? "text-white" : "text-white"
                            }`}
                    >
                        <i className={menu.icon}></i>
                        {menu.label}
                        <span
                            className={`absolute bottom-0 left-0 h-1 bg-white rounded-full transition-all duration-500 ${activeTab === menu.id ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                }`}
                        ></span>
                    </button>
                </li>
            );
        }
    };

    return (
        <div
            className={`lg:relative lg:w-56 lg:translate-x-0 h-full w-full sidebarDashboard fixed left-0 duration-500 z-20
                ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex flex-col gap-2 h-full px-4 transform transition-all duration-300 ease-in-out whitespace-nowrap opacity-100 translate-x-0">
                <ul className="relative h-full space-y-2">
                    {menuItems.map(renderMenuItem)}
                    <li>
                        <button
                            onClick={() => (window.location.href = "/form")}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 text-[#F2F0EF]`}
                        >
                            <i className="pi pi-search"></i>
                            Report Page
                            <i className="ml-4 pi pi-external-link text-xs! opacity-50"></i>
                            <span className="absolute bottom-0 left-0 h-1 bg-[#F2F0EF] rounded-full transition-all duration-500 w-0 group-hover:w-full group-hover:left-0"></span>
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={handleLogout}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 text-[#F2F0EF]`}
                        >
                            <i className="pi pi-sign-out"></i>
                            Logout
                            <span className="absolute bottom-0 left-0 h-1 bg-[#F2F0EF] rounded-full transition-all duration-500 w-0 group-hover:w-full group-hover:left-0"></span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}