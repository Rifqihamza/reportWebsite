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
    <button onClick={handleChangeCampus} className="bg-amber-50 pl-3 pr-4 py-2 text-md rounded-br-xl fixed top-0 left-0 duration-300 hover:bg-[#7FA1C3] hover:text-white z-10"><i className="pi pi-home"></i> Change Campus</button>
  </>
}