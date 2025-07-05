import { Dropdown } from "primereact/dropdown";
import type { AccountType } from "../../../types/variables";

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
        className="w-full rounded-lg! bg-transparent! [&_.p-dropdown]:disabled:border-gray-300! border! border-gray-400! focus:border-gray-800! [&_.p-dropdown]:bg-transparent! [&_.p-dropdown-label]:bg-transparent!  [&_.p-dropdown-label]:text-black! [&_.p-dropdown-trigger]:bg-transparent!"
        placeholder={`Pilih ${props.label}`}
      />
  </>;
}