import { useCampusData } from "../../hooks/shared/useCampusData";
import { Campus, string_to_campus } from "../../types/variables";

interface Props {
  label: string,
  value: string
}

export const campusMap: Record<Campus, string> = {
  [Campus.MM]: "/campusImg/mm2100.jpeg",
  [Campus.PD]: "/campusImg/putraDharma.jpeg",
  [Campus.AMI]: "/campusImg/anandaMI.png",
  [Campus.PATI]: "/campusImg/mm02Pati.png",
  [Campus.SM]: "/campusImg/stellaMaris.jpg",
  [Campus.MOJO]: "/campusImg/asySyarif.png",
  [Campus.BBL]: "/campusImg/babelan.jpg",
  [Campus.KLTN]: "/campusImg/smkKlaten.jpg",
};

export default function SelectCampusButton(props: Props) {
  const { setSelectedCampus } = useCampusData();
  const verified_campus = string_to_campus(props.value);

  const handleClick = () => {
    if (verified_campus) {
      setSelectedCampus(verified_campus);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-white w-full text-xl p-4 cursor-pointer duration-200 rounded-xl flex flex-col items-center gap-2"
    >
      {verified_campus && (
        <div className="relative md:w-1/3 w-[20rem] aspect-video">
          <img
            src={campusMap[verified_campus]}
            alt={`Gambar Kampus ${props.label}`}
            className="object-cover w-full h-full rounded-xl [box-shadow:0_0_20px_rgba(0,0,0,0.7)]"
          />
          <span className="mt-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl absolute top-0 left-2">
            {props.label}
          </span>
        </div>
      )}
    </button>
  );
}