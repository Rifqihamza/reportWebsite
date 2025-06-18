import DateRangeOptions from "./DateRangeOptions";
import FilterOptions from "./FilterOptions";
import OutputOptions from "./OutputOptions";
import RowOptions from "./RowOptions";

export default function ExportComponent() {
    return (
        <div className="h-full w-full p-4 bg-white rounded-2xl relative overflow-auto grid grid-flow-row grid-rows-[auto_1fr]">
            <div className="w-full h-11/12 flex flex-col gap-4 p-4 lg:grid lg:grid-cols-5 lg:grid-rows-3 overflow-auto">
                <RowOptions />
                <OutputOptions />
                <DateRangeOptions />
                {/* <FilterOptions /> */}
            </div>
            {/* Export button */}
            <button className="h-full p-4 bg-[#1f324d] text-white rounded-2xl">Process & Export</button>
        </div>
    )
}