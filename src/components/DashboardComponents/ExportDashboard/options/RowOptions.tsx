import { useExportHook } from "../../../../hooks/pages/Export/useExportHook";
import { table_rows, type ReportData } from '../../../../types/variables';
import { ListBox } from "primereact/listbox";


export default function RowOptions() {
  const rows: ({
    label: string,
    value: keyof ReportData
  })[] = Object.entries(table_rows).map((value) => ({ label: value[0], value: value[1] }));

  const { toggleAllRow, setRow, selectedRows } = useExportHook();

  return <>
    <div className="bg-[#CB6040] w-full h-fit rounded-xl px-6">
      <div className="flex flex-row justify-between items-center px-4 py-5">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-white ">Row Options</h1>
          <span className="text-md lg:text-lg text-white flex flex-row items-center gap-3">
            Opsi baris data yang akan di eksport
            <i className="pi pi-arrow-right"></i>
            </span>
        </div>
        <ListBox
          className="w-fit px-4 py-3 [&_.p-listbox-list]:flex! [&_.p-listbox-list]:items-center! [&_.p-listbox-list]:gap-3! [&_.p-listbox]:border-0!"
          value={selectedRows}
          onChange={(e) => setRow(e.value)}
          options={rows}
          optionLabel="label"
          optionValue="value"
          multiple
        />
      </div>
      <button className={`cursor-pointer w-full text-sm lg:text-md mb-5 px-2 py-3 hover:ring-2 hover:ring-gray-100/50 duration-300 ${((selectedRows.length === Object.values(table_rows).length) ? "bg-[#257180] text-white border-2 " : "bg-[#257180] text-white border-2 border-transparent")} rounded-xl`} onClick={() => { toggleAllRow() }}>{selectedRows.length === Object.values(table_rows).length ? "Remove All" : "Add All"}</button>
    </div>
  </>;
}