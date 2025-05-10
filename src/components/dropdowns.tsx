import React, { useState } from "react";

interface DropdownProps {
  id: string;
  label: string;
  items: string[];
  onChange?: (value: string) => void;
}

export default function Dropdown({ id, label, items, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className="relative text-left w-full dropdown-container" data-dropdown-id={id}>
      <button
        type="button"
        className="dropdown-trigger flex flex-row items-center justify-between w-full px-6 py-2 text-white rounded-xl bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300 "
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="dropdown-label">{selected}</span>
        <svg
          className="w-4 h-4 ml-2"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow divide-y divide-gray-100 dropdown-menu">
          <ul className="py-2 text-sm text-gray-700">
            {items.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="dropdown-item block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleSelect(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <input type="hidden" name={id} value={selected === label ? "" : selected} />
    </div>
  );
}
