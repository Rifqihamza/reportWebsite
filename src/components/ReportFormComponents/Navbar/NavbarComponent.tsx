import LogoutButton from "./LogoutButtonComponent";
import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { userLogout } from "../../../utils/api_interface";
import ChangeCampusButton from "../SelectCampus/ChangeCampusButton";
import DashboardButton from "./DashboardButton";
import { useNetworkConnectivityHook } from "../../../hooks/shared/useNetworkConnectivity";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";

const NavbarComponents = () => {
  const { isConnected } = useNetworkConnectivityHook();
  const { showMessage } = useMessageToastHook();
  
  async function handle_logout() {
    if(!isConnected) return;
    
    if (userData && !(await userLogout())) {
      showMessage("Terjadi error saat ingin logout!", "error");
      return;
    }

    window.location.href = "/loginPage";
  }

  const { userData } = useUserDataHook();
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
      <ChangeCampusButton />
      <DashboardButton />
      <LogoutButton handle_logout={handle_logout} />
    </>
  );
};

export default NavbarComponents;
