

import type { User } from "../../types/variables";
import LogoutButton from '../LogoutButton/LogoutButtonComponent';
interface NavbarProps {
    activeTab: number;
    setActiveTab: (tabIndex: number) => void;
    handle_logout: () => Promise<void>;
    userData: User | null
}

const NavbarComponents = ({ activeTab, setActiveTab, handle_logout, userData }: NavbarProps) => {
    return (
        <>
            {/* Desk Navbar */}
            <div className="flex flex-row items-center justify-evenly px-6 py-2" >
                <button
                    onClick={() => setActiveTab(0)}
                    className={`relative group px-4 py-2 font-semibold uppercase tracking-wider transition-colors duration-300 ${activeTab === 0
                        ? "text-white"
                        : "text-white/80"
                        }`}
                >
                    E-Lapor Website
                    <span
                        className={`absolute bottom-0 left-0 h-1 bg-white rounded-full transition-all duration-500 ${activeTab === 0
                            ? "w-full"
                            : "w-0 group-hover:w-full group-hover:left-0"
                            }`}
                    ></span>
                </button>
            </div >
            {/* Desk Navbar */}

            <LogoutButton handle_logout={handle_logout} userData={userData} />
        </>
    )
}

export default NavbarComponents