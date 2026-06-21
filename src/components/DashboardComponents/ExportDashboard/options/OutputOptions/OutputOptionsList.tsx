import { useExportHook } from "../../../../../hooks/pages/Export/useExportHook";
import { ExportOutputTitles, ExportOutputType } from "../../../../../types/variables";

export default function OutputOptionsList() {
  const outputOptions: ExportOutputType[] = Object.values(ExportOutputType) as ExportOutputType[];
  const { selectedOutputType: selectedOutput, setSelectedOutput } = useExportHook();

  return (
    <>
      {outputOptions.map((value, index) => {
        const titleObj = ExportOutputTitles.find((t) => t.value === value);
        if (!titleObj) return "";

        return (
          <button
            key={index}
            className={`w-full h-full cursor-pointer px-2 py-6 border-2
          ${selectedOutput === value ? "bg-[#1A1D24] border-white text-white" : "bg-[#1A1D24] border-transparent text-white "} 
          rounded-xl duration-300 hover:brightness-75 flex flex-row items-center justify-center gap-3`}
            onClick={() => setSelectedOutput(value)}
          >
            <img src={titleObj.icon} />
            <h1 className="text-lg font-semibold">{titleObj?.title}</h1>
          </button>
        );
      })}
    </>
  );
}
