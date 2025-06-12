import { useEffect, useState } from "react";

interface Props {
    activeTab: number;
    setActiveTab: (tabIndex: number) => void;
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
}

export default function NavbarDashboard({ setActiveTab, showSidebar, activeTab, setShowSidebar }: Props) {

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

    useEffect(() => {
        setShowSidebar(true);
    }, [activeTab]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setShowSidebar(true); // md ke atas, sidebar selalu terbuka
            } else {
                setShowSidebar(false); // mobile, sidebar tertutup default
            }
        };

        handleResize(); // Cek saat pertama kali
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            className={`md:relative md:w-0 md:h-full h-[70vh] w-[calc(100vw_-_(var(--spacing)_*_8))] fixed bg-white shadow shadow-gray-500 rounded-2xl duration-300 z-20 ${showSidebar ? "md:w-[18rem] translate-x-0" : "w-0 opacity-0 -translate-x-full" + (shouldRender ? " md:absolute!" : "")} `}>
            <div
                className={`h-full flex flex-col p-6 transform transition-all duration-300 ease-in-out whitespace-nowrap  ${showSidebar ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
                    }`}
            >
                <ul className="space-y-2 h-full">
                    <li>
                        <button
                            onClick={() => setActiveTab(0)}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 0 ? "text-[#6096B4]" : "text-black/50"
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
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 1 ? "text-[#6096B4]" : "text-black/50"
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
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 2 ? "text-[#6096B4]" : "text-black/50"
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
                    <li>
                        <button
                            onClick={() => setActiveTab(3)}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 3 ? "text-[#6096B4]" : "text-black/50"
                                }`}
                        >
                            <i className="pi pi-file-export"></i>
                            Export
                            <span
                                className={`absolute bottom-0 left-0 h-1 bg-[#6096B4] rounded-full transition-all duration-500 ${activeTab === 3 ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                    }`}
                            ></span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab(4)}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 4 ? "text-[#6096B4]" : "text-black/50"
                                }`}
                        >
                            <i className="pi pi-file-edit"></i>
                            Configuration
                            <span
                                className={`absolute bottom-0 left-0 h-1 bg-[#6096B4] rounded-full transition-all duration-500 ${activeTab === 4 ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                    }`}
                            ></span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab(5)}
                            className={`relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 transition-colors duration-300 ${activeTab === 5 ? "text-[#6096B4]" : "text-black/50"
                                }`}
                        >
                            <i className="pi pi-cog"></i>
                            Setting
                            <span
                                className={`absolute bottom-0 left-0 h-1 bg-[#6096B4] rounded-full transition-all duration-500 ${activeTab === 5 ? "w-full" : "w-0 group-hover:w-full group-hover:left-0"
                                    }`}
                            ></span>
                        </button>
                    </li>
                </ul>
                <button
                    onClick={() => window.location.href = "/"}
                    className={`flex flex-row gap-2 items-center justify-center bg-[#6096b4] rounded-2xl p-4 text-white relative w-full text-left group py-3 font-semibold uppercase tracking-wider space-x-3 cursor-pointer hover:scale-110 hover:brightness-120 duration-300`}
                >
                    <i className="pi pi-search"></i>
                    Report a finding!
                </button>
            </div>
        </div>
    );
}
