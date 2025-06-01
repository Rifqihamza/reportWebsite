import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
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
      {/* Desk Navbar */}
      <div className="hidden md:flex flex-row items-center justify-evenly px-6 py-2">
        <button
          className={`pointer-events-none relative group px-4 py-2 font-semibold uppercase tracking-wider transition-colors duration-300 text-white`}
        >
          Form Laporan
          <span
            className={`absolute bottom-0 left-0 h-1 bg-white rounded-full transition-all duration-500 w-full`}
          ></span>
        </button>
      </div>
      {/* Desk Navbar */}

      <LogoutButton handle_logout={handle_logout} />

      {/* SideBar Section for Mobile */}
      <div className="md:hidden flex flex-row items-center justify-between px-6 py-2 bg-white mb-4">
        <button
          onClick={() => {
            setIsVisible(true);
          }}
        >
          <MenuIcon />
        </button>
        <img src="/img/logoSekolah.png" alt="" className="w-9 h-auto" />
      </div>

      <Sidebar
        className="bg-white px-2 py-1 rounded-r-4xl"
        showCloseIcon={true}
        position="left"
        visible={setVisible}
        onHide={() => setIsVisible(false)}
      >
        {/* End Sidebar Section for Mobile */}
        <div className="flex flex-col items-start justify-center w-full gap-2">
          <button
            onClick={() => {
              setIsVisible(false);
            }}
            className={`w-full text-left px-4 py-2 rounded-lg bg-[#7FA1C3] text-white`}
          >
            Form Laporan
          </button>
        </div>

        <div className="absolute left-4 right-4 bottom-4">
          <button
            className="w-full justify-center md:hidden block px-4 py-2 text-white rounded-xl bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300"
            onClick={handle_logout}
          >
            {!userData || userData.role == AccountType.Siswa ? "Login" : "Logout"}
          </button>
        </div>
      </Sidebar>
      {/* End Mobile Sidebar */}
    </>
  );
};

export default NavbarComponents;
