import { Dropdown } from "primereact/dropdown";

interface DropdownProps<T extends { toString(): string }> {
  optional?: boolean;
  disabled?: boolean
  label?: string;
  icon?: string;
  placeholder?: string;
  items: T[];
  selected: T|null;
  onSelect: (value: T|null) => void;
}

export default function ReportFormDropdown<T extends { toString(): string }>(props: DropdownProps<T>) {
  return (
    <div className="bg-[#93BFCF] rounded-2xl w-full mt-[1.5rem]">
      <div className="flex flex-row justify-between items-center px-4 py-3">
        <div className="md:text-lg font-semibold text-xs text-white flex flex-row gap-2 items-center">
          <i className={props.icon}></i>
          <h1>{props.label} {props.optional ?  <span className="opacity-50">(opsional)</span> : ""}</h1>
        </div>
        { props.optional ? <button type="button" className="cursor-pointer hover:text-[#7FA1C3] disabled:opacity-0 disabled:pointer-events-none" disabled={props.selected == null} onClick={() => props.onSelect(null)}>Clear</button> : "" }
      </div>

      <div className="outline-none px-6 py-1 w-full bg-amber-50 rounded-2xl [box-shadow:0_0_4px_1px_#93BFCF]">
        <Dropdown disabled={props.disabled} value={props.selected} onChange={(e) => props.onSelect(e.value)} options={props.items} optionLabel="name" placeholder={props.placeholder} className="!rounded-2xl !bg-amber-50 !border-none w-full !focus:outline-none" />
      </div>
    </div>
  );
}
