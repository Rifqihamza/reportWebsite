import { useEffect } from "react";
import { useExportHook } from "../../../hooks/useExportHook";
import { table_rows, type ReportData } from '../../../types/variables';


export default function RowOptions() {
  const rows: (keyof ReportData)[] = Object.keys(table_rows) as (keyof ReportData)[];
  const { toggleAllRow, toggleRow, selectedRows } = useExportHook();

  useEffect(() => {
    console.log(selectedRows);
  }, [selectedRows])

  return <>
    <div className="bg-[#1f324d] w-full h-full rounded-xl shadow-md shadow-gray-400 row-span-3 flex flex-col relative">
      <div className="absolute -top-2 -right-2 bg-[#263d5d] rounded-full p-2 w-8 h-8 flex items-center justify-center shadow-md shadow-gray-700">
        <h1 className="text-white font-medium">1</h1>
      </div>
      <h1 className="text-md lg:text-xl text-white py-3 px-6 w-full text-center">Opsi Barisan</h1>
      <div className="bg-[#ededed] w-full h-full rounded-xl flex flex-col gap-2 p-2 overflow-auto">
        {rows.map((value) => {
          return <button className={`cursor-pointer text-sm lg:text-md px-2 py-4 border-2 hover:brightness-75 ${(selectedRows.includes(value) ? "bg-[#1f324d] text-white" : "bg-white text-[#1f324d] border-[#1f324d]")} rounded-xl`} onClick={() => { toggleRow(value) }}>{value}</button>;
        })}
        <button className={`cursor-pointer text-sm lg:text-md px-2 py-4 border-2 hover:brightness-75 ${((selectedRows.length ===  Object.values(table_rows).length) ? "bg-[#1f324d] text-white" : "bg-white text-[#1f324d] border-[#1f324d]")} rounded-xl`} onClick={() => { toggleAllRow() }}>Add All</button>
      </div>
    </div>
  </>;
}