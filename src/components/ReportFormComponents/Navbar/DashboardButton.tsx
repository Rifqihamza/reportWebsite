import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { AccountType } from "../../../types/variables";

export default function DashboardButton() {
  const { userData } = useUserDataHook();
  
  const handleGoToDashboard = () => {
    window.location.href = "/dashboard";
  }
  
  if(userData && userData.role === AccountType.Admin) {
    return <>
      
        <button
            className="h-12 flex items-center overflow-hidden px-4 py-3 bg-amber-50 hover:bg-[#7FA1C3] hover:text-white rounded-bl-xl fixed top-24 right-0 hover:rounded-l-xl hover:w-[14rem] w-[3rem] duration-300 cursor-pointer group"
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