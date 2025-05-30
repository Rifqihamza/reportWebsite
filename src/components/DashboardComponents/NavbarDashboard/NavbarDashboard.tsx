import { useEffect, useState } from "react";

interface NavProps {
    activeTab: number;
    setActiveTab: (tabIndex: number) => void;
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
}

export default function NavbarDashboard({ setActiveTab, showSidebar, activeTab }: NavProps) {

    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        if (!showSidebar) {
            setTimeout(() => {
                setShouldRender(true);
            }, 300);
        }
        else {
            setShouldRender(false);
        }
    }, [showSidebar])

    return (
        <div
            className={`bg-white shadow rounded-2xl duration-300 z-20 ${showSidebar ? "w-[18rem] translate-x-0" : "w-0 opacity-0 -translate-x-full" + (shouldRender ? " fixed" : "")} `}>
            <div
                className={`p-6 transform transition-all duration-300 ease-in-out whitespace-nowrap  ${showSidebar ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
                    }`}
            >
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => setActiveTab(0)}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 0 ? "text-black" : "text-black/50"
                                }`}
                        >
                            <i className="pi pi-home"></i>
                            Home
                            <span
                                className={`absolute bottom-0 left-0 h-1 bg-[#6096B4] rounded-full transition-all duration-500 ${activeTab === 0 ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                    }`}
                            ></span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab(1)}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 1 ? "text-black" : "text-black/50"
                                }`}
                        >
                            <i className="pi pi-clipboard"></i>
                            Table Report
                            <span
                                className={`absolute bottom-0 left-0 h-1 bg-[#6096B4] rounded-full transition-all duration-500 ${activeTab === 1 ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                    }`}
                            ></span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab(2)}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 2 ? "text-black" : "text-black/50"
                                }`}
                        >
                            <i className="pi pi-chart-bar"></i>
                            Graphic Chart
                            <span
                                className={`absolute bottom-0 left-0 h-1 bg-[#6096B4] rounded-full transition-all duration-500 ${activeTab === 2 ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                    }`}
                            ></span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
