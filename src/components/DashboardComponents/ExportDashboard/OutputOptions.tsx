import { useExportHook } from "../../../hooks/useExportHook";
import { ExportOutputType } from "../../../types/variables";


export default function OutputOptions() {
  const outputOptions: ExportOutputType[] = Object.values(ExportOutputType) as ExportOutputType[];
  const { selectedOutput, setSelectedOutput } = useExportHook();
  
  return <>
    <div className="bg-[#1f324d] w-full h-full rounded-xl row-span-3 flex flex-col">
      <h1 className="text-md lg:text-xl text-white py-3 px-6 w-full text-center">Opsi Output</h1>
      <div className="bg-[#ededed] h-full rounded-xl flex flex-col gap-2 p-2 overflow-auto">
          {outputOptions.map((value) => {
            return <button className={`cursor-pointer p-2 text-sm lg:text-md border-2 ${(selectedOutput === value ? "bg-[#1f324d] text-white" : "bg-white text-[#1f324d] border-[#1f324d]")} rounded-xl`} onClick={() => {setSelectedOutput(value)}}>{value}</button>;
          })}
      </div>
    </div>
  </>;
}