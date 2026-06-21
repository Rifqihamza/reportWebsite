import { useExportHook } from "../../../../../hooks/pages/Export/useExportHook";
import { exportable_rows, type ReportData } from "../../../../../types/variables";
import { ListBox } from "primereact/listbox";

export default function RowOptionsListBox() {
  const rows: {
    label: string;
    value: keyof ReportData;
  }[] = Object.entries(exportable_rows).map((value) => ({ label: value[0], value: value[1] }));

  const { toggleAllRow, setRow, selectedRows } = useExportHook();
  return (
    <>
      <ListBox
        className="w-full py-3 [&_.p-listbox-list]:flex! [&_.p-listbox-list]:flex-col! [&_.p-listbox-list]:*:w-full [&_.p-listbox-list]:*:text-center! [&_.p-listbox-list]:items-center! [&_.p-listbox-list]:gap-2! [&_.p-listbox]:border-0!"
        value={selectedRows}
        onChange={(e) => setRow(e.value)}
        options={rows}
        optionLabel="label"
        optionValue="value"
        multiple
      />
      <button
        className={`cursor-pointer w-full text-sm lg:text-md mb-5 px-2 py-3 hover:ring-2 hover:ring-gray-100/50 duration-300 bg-[#1a1d24] ${selectedRows.length === Object.values(exportable_rows).length ? "text-white border-2 " : "text-white border-2 border-transparent"} rounded-xl`}
        onClick={() => {
          toggleAllRow();
        }}
      >
        {selectedRows.length === Object.values(exportable_rows).length ? "Remove All" : "Add All"}
      </button>
    </>
  );
}
