import { Dropdown } from "primereact/dropdown";
import { LineChartTimeCategoryOption, useLineChartHook } from "../../../../hooks/useChartHook";

export default function TimeChartFilter() {
  const options = Object.values(LineChartTimeCategoryOption);

  const { chartTimeCategoryFilter, setChartTimeCategoryFilter } = useLineChartHook();

  return <>
    <div className="md:hidden block w-full">
        <Dropdown
            className="px-4 py-2 rounded-xl! [&_.p-dropdown-label]:text-[#1f324d]! [&_.p-dropdown-trigger]:text-[#1f324d]! bg-white! [&_.p-dropdown]:bg-white! [&_.p-dropdown-label]:bg-white! [&_.p-dropdown-trigger]:bg-white! md:[&_.p-dropdown-label]:text-white! md:[&_.p-dropdown-trigger]:text-white! md:bg-[#1f324d]! md:[&_.p-dropdown]:bg-[#1f324d]! md:[&_.p-dropdown-label]:bg-[#1f324d]! md:[&_.p-dropdown-trigger]:bg-[#1f324d]!"
            onChange={(e) => setChartTimeCategoryFilter(e.value)}
            value={chartTimeCategoryFilter}
            options={Object.values(LineChartTimeCategoryOption)} />
    </div>
    <div className="w-full hidden md:flex md:flex-row md:justify-between md:gap-3 bg-white px-4 py-3 rounded-2xl">
        {options.map((option) => (
            <button
                key={option}
                onClick={() => setChartTimeCategoryFilter(option)}
                className={`p-4 rounded-lg w-full ${chartTimeCategoryFilter === option ? 'bg-[#1f324d] text-white' : 'bg-gray-200 hover:bg-[#1f324d]/20 text-black'
                    }`}
            >
                {option}
            </button>
        ))}
    </div>
  </>;
}