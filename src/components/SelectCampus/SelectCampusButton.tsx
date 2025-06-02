import { useCampusData } from "../../hooks/shared/useCampusData";
import { string_to_campus } from "../../types/variables";

interface Props {
  label: string,
  value: string
}

export default function SelectCampusButton(props: Props) {
  const { setSelectedCampus } = useCampusData();

  const handleClick = () => {
    const verified_campus = string_to_campus(props.value);
    if(verified_campus) {
      setSelectedCampus(verified_campus);
    }
  }
  
  return <button className="bg-white text-black w-[100px] text-xl p-2 aspect-square cursor-pointer hover:bg-white/20 duration-200 rounded-xl" onClick={handleClick}>{props.label}</button>
}