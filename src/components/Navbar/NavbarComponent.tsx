
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
            <div className="mb-4 px-4 py-2 bg-white rounded-[50px] hidden md:flex flex-row items-center gap-6 mx-5" >
                <button
                    onClick={() => setActiveTab(1)}
                    className={`tab-button ${activeTab === 1 ? "active" : ""}`}
                >
                    Report Form
                </button>
                <button
                    onClick={() => setActiveTab(0)}
                    className={`tab-button ${activeTab === 0 ? "active" : ""}`}
                >
                    Table Data
                </button>
                <button
                    onClick={() => setActiveTab(2)}
                    className={`tab-button ${activeTab === 2 ? "active" : ""}`}
                >
                    Chart Data
                </button>
            </div >

            {/* SideBar Section for Mobile */}
            <div className="md:hidden flex flex-row items-center justify-between px-6 py-2 bg-white rounded-xl mb-4" >
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
                            setActiveTab(1);
                            setIsVisible(false);
                        }} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 1 ? "bg-[#7FA1C3] text-white" : "hover:bg-gray-300 duration-300"}`}
                    >
                        Report Form
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab(0);
                            setIsVisible(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 0 ? "bg-[#7FA1C3] text-white" : "hover:bg-gray-300 duration-300"}`}
                    >
                        Table Data
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