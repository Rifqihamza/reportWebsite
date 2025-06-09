import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { AccountType } from "../../types/variables";
import LogoutButton from "../LogoutButton/LogoutButtonComponent";
import { useUserDataHook } from "../../hooks/shared/useUserData";
import { userLogout } from "../../utils/api_interface";

const NavbarComponents = () => {
  async function handle_logout() {
    if (userData && !(await userLogout())) {
      alert("Terjadi error saat ingin logout!");
      return;
    }

    window.location.href = "/loginPage";
  }

  const { userData } = useUserDataHook();
  const [setVisible, setIsVisible] = useState<boolean>(false);

  const isAuthorized =
    userData && (userData.role === AccountType.Guru || userData.role === AccountType.Vendor);

  return (
    <>
      <div className="flex flex-row items-center justify-evenly px-6 py-2">
        <button
          className={`pointer-events-none relative group px-4 py-2 font-semibold uppercase tracking-wider transition-colors duration-300 text-white`}
        >
          Form Laporan
          <span
            className={`absolute bottom-0 left-0 h-1 bg-white rounded-full transition-all duration-500 w-full`}
          ></span>
        </button>
      </div>
      <LogoutButton handle_logout={handle_logout} />
    </>
  );
};

export default NavbarComponents;
