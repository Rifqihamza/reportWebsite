import LogoutButton from "./LogoutButtonComponent";
import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { userLogout } from "../../../utils/api_interface";
import ChangeCampusButton from "../SelectCampus/ChangeCampusButton";
import DashboardButton from "./DashboardButton";
import { useNetworkConnectivityHook } from "../../../hooks/shared/useNetworkConnectivity";
import { useCampusDataHook } from "../../../hooks/pages/ReportForm/useCampusData";

const NavbarComponents = () => {
  const { isConnected } = useNetworkConnectivityHook();
  const { userData } = useUserDataHook();
  const { selectedCampus } = useCampusDataHook();
  
  async function handle_logout() {
    if(!isConnected) return;
    
    if (userData && !(await userLogout())) {
      alert("Terjadi error saat ingin logout!");
      return;
    }

    window.location.href = "/loginPage";
  }

  return (
    <>
      <div className="flex flex-row items-center justify-evenly px-6 pt-4">
        <button
          className={`text-xl pointer-events-none relative group px-4 pb-2 font-semibold uppercase tracking-wider transition-colors duration-300 text-[#cb6040]`}
        >
          Form Laporan
          <span
            className={`absolute bottom-0 left-0 h-1 bg-[#cb6040] rounded-full transition-all duration-500 w-full`}
          ></span>
        </button>
      </div>
      <p className="text-[#cb6040] w-full text-center mt-1 mb-3">Campus: {selectedCampus}</p>
      <ChangeCampusButton />
      <DashboardButton />
      <LogoutButton handle_logout={handle_logout} />
    </>
  );
};

export default NavbarComponents;
