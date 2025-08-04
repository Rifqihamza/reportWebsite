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
    <div className="bg-[#374151] w-full h-fit rounded-xl px-3">
      <div className="flex flex-col md:flex-row justify-between px-4 py-5">
        <div className="w-full">
          <h1 className="text-xl lg:text-2xl font-semibold text-white ">Row Options</h1>
          <span className="w-max text-md lg:text-lg text-white flex flex-row items-center gap-3">
            Opsi baris data yang akan di eksport
            <i className="pi pi-arrow-right hidden! md:inline!"></i>
          </span>
        </div>
        <div className="w-full flex justify-center items-center">
          <ListBox
            className="w-full md:px-4 py-3 [&_.p-listbox-list]:flex! [&_.p-listbox-list]:flex-col! [&_.p-listbox-list]:*:w-full! [&_.p-listbox-list]:*:text-center! [&_.p-listbox-list]:items-center! [&_.p-listbox-list]:gap-2! [&_.p-listbox]:border-0!"
            value={selectedRows}
            onChange={(e) => setRow(e.value)}
            options={rows}
            optionLabel="label"
            optionValue="value"
            multiple
          />
        </div>
      </div>
      <div className="w-full px-5">
        <button className={`cursor-pointer w-full text-sm lg:text-md mb-5 px-2 py-3 hover:ring-2 hover:ring-gray-100/50 duration-300 bg-[#1a1d24] ${((selectedRows.length === Object.values(table_rows).length) ? "text-white border-2 " : "text-white border-2 border-transparent")} rounded-xl`} onClick={() => { toggleAllRow() }}>{selectedRows.length === Object.values(table_rows).length ? "Remove All" : "Add All"}</button>
      </div>
    </div>
  </>;
}