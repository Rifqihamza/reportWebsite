import { useEffect } from "react";
import { useFormSidebarHooks } from "../../../hooks/pages/ReportForm/useFormSidebarHooks";
import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { useCampusDataHook } from "../../../hooks/pages/ReportForm/useCampusData";
import { userLogout } from "../../../utils/api_interface";
import FormSidebarNotification from "./FormSidebarNotification";


export default function FormSidebarComponent() {
      const { isOpen, setIsOpen } = useFormSidebarHooks();
      const { userData, isPIC, isAuthorized } = useUserDataHook();
      const { selectedCampus, setSelectedCampus } = useCampusDataHook();

      const goToAdminDashboard = () => {
            window.location.href = "/dashboard";
      }

      const changeCampus = () => {
            setSelectedCampus(null);
            setIsOpen(false);
      }

      const logout = async () => {
            await userLogout();
            window.location.href = "/login";
      }
      
      return <div className={`w-screen flex-1 z-102 duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none **:pointer-events-none"}`}>
            <div className="fixed w-full h-full bg-black/70 z-0" onClick={() => setIsOpen(!isOpen)}></div>
            <div className={`w-full md:w-2/5 h-full bg-black/90 backdrop-blur-lg duration-500 flex flex-col justify-between p-2 z-1 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                  <div>
                        <div className="flex flex-col gap-2 p-2 *:p-4 *:rounded-lg *:bg-[#1a1d24] *:cursor-pointer *:duration-200 *:hover:brightness-50">
                              {
                                    selectedCampus && <button onClick={changeCampus}>Change Campus</button>
                              }
                              {
                                    isAuthorized && <button onClick={goToAdminDashboard}>Admin Dashboard</button>
                              }
                              <button onClick={logout}>Logout</button>
                        </div>
                        
                        <div className="mt-4 p-2">
                              <FormSidebarNotification />
                        </div>
                  </div>
                  
                  <div className="py-4">
                        <p className={`font-thin ${isAuthorized == null && "opacity-50"}`}>Username: <span className="font-semibold">{userData?.username || "-"}</span> {isPIC !== null && (isPIC ? "[PIC]" : "")}</p>
                  </div>
            </div>
      </div>;
}