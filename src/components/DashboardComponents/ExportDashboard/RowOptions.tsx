import { useExportHook } from "../../../hooks/useExportHook";
import { table_rows, type ReportData } from '../../../types/variables';


export default function RowOptions() {
  const rows: (keyof ReportData)[] = Object.keys(table_rows) as (keyof ReportData)[];
  const { toggleRow, selectedRows } = useExportHook();
  
  return <>
    <div className="bg-[#1f324d] w-full h-full rounded-xl row-span-3 flex flex-col">
      <h1 className="text-md lg:text-xl text-white py-3 px-6 w-full text-center">Opsi Barisan</h1>
      <div className="bg-[#ededed] h-full rounded-xl flex flex-col gap-2 p-2 overflow-auto">
          {rows.map((value) => {
            return <button className={`cursor-pointer text-sm lg:text-md p-2 border-2 ${(selectedRows.includes(value) ? "bg-[#1f324d] text-white" : "bg-white text-[#1f324d] border-[#1f324d]")} rounded-xl`} onClick={() => {toggleRow(value)}}>{value}</button>;
          })}
      </div>
    </div>
  </>;
}