import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { AccountType, has_access_to_dashboard } from "../../../types/variables";

export default function DashboardButton() {
  const { userData } = useUserDataHook();
  
  const handleGoToDashboard = () => {
    window.location.href = "/dashboard";
  }
  
  if(userData && has_access_to_dashboard(userData.role)) {
    return <>
      
        <button
            className="h-12 flex items-center overflow-hidden px-4 py-3 hover:shadow hover:shadow-gray-500 text-[#F2E5BF] bg-[#CB6040] hover:bg-[#FD8B51] hover:text-white rounded-bl-xl fixed top-24 right-0 hover:rounded-l-xl hover:w-[14rem] w-[3rem] duration-300 cursor-pointer group"
            onClick={handleGoToDashboard}
        >
            <i className="pi pi-chart-bar mr-2"></i>
            <span
                className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                Admin Dashboard
            </span>
        </button>
    </>
  }
  else {
    return <></>
  }
}