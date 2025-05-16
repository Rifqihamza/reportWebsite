import { useState, type Dispatch, type SetStateAction } from "react";

interface DropdownProps<T extends { toString(): string }> {
  id: string;
  label?: string;
  icon?: string;
  items: T[];
  selected: T|null;
  setSelected: Dispatch<SetStateAction<T|null>>;
}

export default function Dropdown<T extends { toString(): string }>({ id, label, icon, items, selected, setSelected }: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: T) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative text-left w-full dropdown-container" data-dropdown-id={id}>
      <span className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center mb-3">
        <i className={icon}></i>
        <h1>{label}</h1>
      </span>
      <button
        type="button"
        className="dropdown-trigger flex flex-row items-center justify-between w-full px-4 py-3 text-white rounded-xl bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300 "
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="dropdown-label">{selected ? selected.toString() : label}</span>
        <i className="pi pi-angle-down" />
      </button >

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow divide-y divide-gray-100 dropdown-menu">
          <ul className="py-2 text-sm text-gray-700">
            {items.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="dropdown-item block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleSelect(item)}
                >
                  {item.toString()}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )
      }
    </div >
  );
}
