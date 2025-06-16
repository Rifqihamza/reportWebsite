import { useCampusDataHook } from "../../../hooks/shared/useCampusData";
import { Campus, string_to_campus } from "../../../types/variables";

interface Props {
  label: string,
  value: string
}

export const campusMap: Record<Campus, { image: string; name: string }> = {
  [Campus.MM]: { image: "/campusImg/mm2100.jpeg", name: "SMK Mitra Industri MM2100" },
  [Campus.PD]: { image: "/campusImg/putraDharma.jpeg", name: "SMK Mitra Industri 03" },
  [Campus.AMI]: { image: "/campusImg/anandaMI.png", name: "SMK Ananda Mitra Industri" },
  [Campus.PATI]: { image: "/campusImg/mm02Pati.png", name: "SMK Mitra Industri 02" },
  [Campus.SM]: { image: "/campusImg/stellaMaris.jpg", name: "SMK Stella Maris Labuan Bajo" },
  [Campus.MOJO]: { image: "/campusImg/asySyarif.png", name: "SMK Asy-Syarif Mojokerto" },
  [Campus.BBL]: { image: "/campusImg/babelan.jpg", name: "SMK Negeri 1 Babelan" },
  [Campus.KLTN]: { image: "/campusImg/smkKlaten.jpg", name: "SMK Kristen 2 Klaten " },
};

export default function SelectCampusButton(props: Props) {
  const { setSelectedCampus } = useCampusDataHook();
  const verified_campus = string_to_campus(props.value);

  const handleClick = () => {
    if (verified_campus) {
      setSelectedCampus(verified_campus);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-white w-full h-full text-xl p-4 cursor-pointer duration-200 rounded-xl flex flex-col items-center gap-2"
    >
      {verified_campus && (
        <div className="relative md:w-1/3 w-[20rem] aspect-video">
          <img
            src={campusMap[verified_campus].image}
            alt={`Gambar Kampus ${campusMap[verified_campus].name}`}
            className="object-cover w-full h-full rounded-xl [box-shadow:0_0_20px_rgba(0,0,0,0.7)]"
          />
          <span className="mt-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl absolute top-0 left-2">
            {campusMap[verified_campus].name}
          </span>
        </div>
      )}
    </button>
  );
}