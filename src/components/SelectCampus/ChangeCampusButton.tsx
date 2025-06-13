import { useCampusDataHook } from "../../hooks/shared/useCampusData";


export default function ChangeCampusButton() {
  const { selectedCampus, setSelectedCampus } = useCampusDataHook();

  const handleChangeCampus = () => {
    if(selectedCampus) {
      setSelectedCampus(null);
    }
    window.location.reload();
  }

  return <>
        <button
            className="h-12 flex items-center overflow-hidden px-4 py-3 bg-amber-50 hover:bg-[#7FA1C3] hover:text-white fixed top-12 right-0 hover:w-[11rem] w-[3rem] duration-300 cursor-pointer group"
            onClick={handleChangeCampus}
        >
            <i className="pi pi-home mr-2"></i>
            <span
                className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                Change Campus
            </span>
        </button>
      </>
}