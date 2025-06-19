import { useCampusDataHook } from "../../../hooks/shared/useCampusData";
import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { AccountType } from "../../../types/variables";


export default function ChangeCampusButton() {
  const { selectedCampus, setSelectedCampus } = useCampusDataHook();
  const { userData } = useUserDataHook();

  const handleChangeCampus = () => {
    if(selectedCampus) {
      setSelectedCampus(null);
    }
  }
  

  return <>
        <button
            className={`h-12 flex items-center overflow-hidden px-4 py-3 bg-amber-50 hover:bg-[#7FA1C3] hover:text-white fixed top-12 right-0 hover:w-[11rem] hover:rounded-l-xl w-[3rem] duration-300 cursor-pointer group ${(!userData || userData.role !== AccountType.Guru && userData.role !== AccountType.Vendor) ? "" : ""}`}
            onClick={handleChangeCampus}
        >
            <i className="pi pi-map-marker mr-2"></i>
            <span
                className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                Change Campus
            </span>
        </button>
      </>
}