import { useUserDataHook } from "../../hooks/shared/useUserData";
import { AccountType } from "../../types/variables";

export default function DashboardButton() {
  const { userData } = useUserDataHook();
  
  const handleGoToDashboard = () => {
    window.location.href = "/dashboard";
  }
  
  if(userData && (userData.role === AccountType.Guru || userData.role === AccountType.Vendor)) {
    return <>
      <button onClick={handleGoToDashboard} className="bg-amber-50 pl-5 pr-4 py-2 text-md rounded-br-xl fixed top-0 left-38 duration-300 hover:bg-[#7FA1C3] hover:text-white z-0"><i className="pi pi-home"></i> Admin Dashboard</button>
    </>
  }
  else {
    return <></>
  }
}