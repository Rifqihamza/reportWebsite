
import { Sidebar } from 'primereact/sidebar';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountType, type User } from "../../types/variables";
interface NavbarProps {
    activeTab: number;
    setActiveTab: (tabIndex: number) => void;
    handle_logout: () => Promise<void>;
    userData: User | null
}

const NavbarComponents = ({ activeTab, setActiveTab, handle_logout, userData }: NavbarProps) => {
    const [setVisible, setIsVisible] = useState<boolean>(false);

    return (
        <>
            {/* Desk Navbar */}

            <div className="hidden md:flex flex-row items-center justify-evenly px-6 py-2" >
                {["Form Laporan", "Data Laporan", "Grafik Laporan"].map((label, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`relative group px-4 py-2 font-semibold uppercase tracking-wider transition-colors duration-300 ${activeTab === index ? "text-white" : "text-white/80"
                            }`}
                    >
                        {label}
                        <span
                            className={`absolute bottom-0 left-0 h-1 bg-white rounded-full transition-all duration-500 ${activeTab === index
                                ? "w-full"
                                : "w-0 group-hover:w-full group-hover:left-0"
                                }`}
                        ></span>
                    </button>
                ))}

                <button
                    className='relative bottom-0 left-0 h-10 bg-transparent text-white font-semibold py-2 px-4 uppercase tracking-wider overflow-hidden group'
                    onClick={handle_logout}>
                    {(!userData || userData.role == AccountType.Siswa) ? "Login" : "Logout"}
                    <span className='absolute bottom-0 left-0 h-1 bg-white rounded-full transition-all duration-500 w-0 group-hover:w-full'></span>
                </button>
            </div >

            {/* SideBar Section for Mobile */}
            <div className="md:hidden flex flex-row items-center justify-between px-6 py-2 bg-white mb-4" >
                <button onClick={() => { setIsVisible(true) }}>
                    <MenuIcon />
                </button>
                <img src="/img/logoSekolah.png" alt="" className="w-9 h-auto" />
            </div >

            <Sidebar className="bg-white px-2 py-1 rounded-r-4xl" showCloseIcon={true} position="left" visible={setVisible} onHide={() => setIsVisible(false)}>
                {/* End Sidebar Section for Mobile */}
                <div className="flex flex-col items-start justify-center w-full gap-2">
                    <button
                        onClick={() => {
                            setActiveTab(0);
                            setIsVisible(false);
                        }} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 0 ? "bg-[#7FA1C3] text-white" : "hover:bg-gray-300 duration-300"}`}
                    >
                        Form Laporan
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab(1);
                            setIsVisible(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 1 ? "bg-[#7FA1C3] text-white" : "hover:bg-gray-300 duration-300"}`}
                    >
                        Data Laporan
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab(2);
                            setIsVisible(false);
                        }} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 2 ? "bg-[#7FA1C3] text-white" : "hover:bg-gray-300 duration-300"}`}
                    >
                        Chart Data
                    </button>
                </div>

                <div className="absolute left-4 right-4 bottom-4">
                    <button className="w-full justify-center md:hidden block px-4 py-2 text-white rounded-xl bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300"
                        onClick={handle_logout}
                    >
                        {(!userData || userData.role == AccountType.Siswa) ? "Login" : "Logout"}
                    </button>
                </div>
            </Sidebar>
        </>
    )
}

export default NavbarComponents