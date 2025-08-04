import { Dropdown } from "primereact/dropdown";

interface Props {
  label: string;
  options: any[];
  value: any;
  onChange?: (e: any) => void;
  disabled?: boolean;
  filter?: boolean;
}

export default function DropdownComponent(props: Props) {
  return <>
      <Dropdown
        filter={props.filter}
        disabled={props.disabled}
        value={props.value}
        options={props.options}
        onChange={props.onChange}
        className="w-full rounded-lg! bg-transparent! [&_.p-dropdown]:disabled:border-gray-300! border! border-gray-400! focus:border-gray-800! [&_.p-dropdown]:bg-transparent! [&_.p-dropdown-label]:bg-transparent!  [&_.p-dropdown-label]:text-white! [&_.p-dropdown-trigger]:bg-transparent!"
        panelClassName="[&_.p-dropdown-header]:rounded-lg! rounded-lg! [&_.p-dropdown-filter]:placeholder:text-white! [&_.p-dropdown-filter]:placeholder:opacity-50 [&_.p-dropdown-header]:bg-[#fd8b51]! [&_.p-dropdown-header]:**:text-white! [&_.p-dropdown-header]:**:bg-[#257180]! [&_.p-focus]:bg-[#fd8b51]! [&_.p-dropdown-item]:hover:bg-[#257180]! [&_.p-dropdown-item]:hover:text-white!"
        placeholder={`Pilih ${props.label}`}
        filterPlaceholder={`Cari ${props.label}`}
      />
  </>;
}