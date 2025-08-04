import { useExportHook } from "../../../../hooks/pages/Export/useExportHook";
import { ExportOutputTitles, ExportOutputType } from "../../../../types/variables";

export default function OutputOptions() {
  const outputOptions: ExportOutputType[] = Object.values(ExportOutputType) as ExportOutputType[];
  const { selectedOutputType: selectedOutput, setSelectedOutput } = useExportHook();

  return (
    <>
      <div className="bg-[#374151] w-full h-fit rounded-xl px-3">
        <div className="flex flex-col gap-2 md:flex-row md:gap-0 justify-between px-4 py-5">
          <div className="w-full">
            <h1 className="text-xl lg:text-2xl font-semibold text-white ">Output Option</h1>
            <span className="text-md lg:text-lg text-white flex flex-row items-center gap-3">
              Opsi output tipe file
              <i className="pi pi-arrow-right hidden! md:inline!"></i>
            </span>
          </div>
          <div className="flex flex-row items-center gap-4 w-full">
            {outputOptions.map((value, index) => {
              const titleObj = ExportOutputTitles.find((t) => t.value === value);
              if (!titleObj) return "";

              return (
                <button
                  key={index}
                  className={`w-full h-full cursor-pointer px-2 py-6 border-2
                ${selectedOutput === value
                      ? "bg-[#1A1D24] border-white text-white"
                      : "bg-[#1A1D24] border-transparent text-white "} 
                rounded-xl duration-300 hover:brightness-75 flex flex-row items-center justify-center gap-3`}
                  onClick={() => setSelectedOutput(value)}
                >
                  <img src={titleObj.icon} />
                  <h1 className="text-lg font-semibold">{titleObj?.title}</h1>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}