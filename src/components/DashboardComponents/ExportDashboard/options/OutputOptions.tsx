import { useExportHook } from "../../../../hooks/pages/Export/useExportHook";
import { ExportOutputType } from "../../../../types/variables";


export default function OutputOptions() {
  const outputOptions: ExportOutputType[] = Object.values(ExportOutputType) as ExportOutputType[];
  const { selectedOutputType: selectedOutput, setSelectedOutput } = useExportHook();

  return <>
    <div className="bg-[#FD8B51] w-full h-fit shadow-sm shadow-gray-400 rounded-xl row-span-3 flex flex-col relative">
      <div className="absolute -top-2 -right-2 bg-[#263d5d] rounded-full p-2 w-8 h-8 flex items-center justify-center shadow-md shadow-gray-700">
        <h1 className="text-white font-medium">4</h1>
      </div>
      <h1 className="text-md lg:text-xl text-white py-3 px-6 w-full text-center">Opsi Output</h1>
      <div className="bg-[#257180] w-full h-full rounded-xl flex flex-col gap-2 p-2 overflow-auto">
        {outputOptions.map((value, index) => {
          return <button
            key={index}
            className={`w-full h-full cursor-pointer px-2 py-6 border-2 text-sm lg:text-md
               ${(selectedOutput === value ?
                "bg-[#FD8B51] border-white text-white"
                :
                "bg-[#257180] text-white border-white hover:bg-[#CB6040]")}
                   rounded-xl duration-300 hover:brightness-75`} onClick={() => { setSelectedOutput(value) }}>{value}</button>;
        })}
      </div>
    </div>
  </>;
}