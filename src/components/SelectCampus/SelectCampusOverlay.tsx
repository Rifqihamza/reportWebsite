import { useCampusData } from "../../hooks/shared/useCampusData";
import { Campus } from "../../types/variables";
import SelectCampusButton from "./SelectCampusButton";

export default function SelectCampusOverlay() {
  const { selectedCampus } = useCampusData();
  
  return <div className={"fixed z-100 w-dvw h-dvh bg-black/40 p-10 box-border flex flex-col justify-center items-center duration-200" + (selectedCampus ? " opacity-0 pointer-events-none" : "")}>
    <h1 className="text-3xl text-white">Pilih Kampus:</h1>
    <div className="mt-2 flex flex-row gap-4">
      {Object.values(Campus).map((value) => (
        <SelectCampusButton label={value} value={value} />
      ))}
    </div>
  </div>
}