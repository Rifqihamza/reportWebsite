import { useState } from 'react';
import { ReportType, ReportStatus, reporttype_to_string, Campus, string_to_reporttype } from "../../../../types/variables";
import { MultiSelect } from 'primereact/multiselect';

// Icon
import { useReportFilterHook } from '../../../../hooks/pages/ReportTable/useReportHook';
import UseReportConfigHookEffect, { useReportConfigHook } from "../../../../hooks/shared/useReportConfig";
import type { SelectItemOptionsType } from "primereact/selectitem";

export default function FilterSelect() {
    const { selectedFilter, setSelectedFilter, resetFilter } = useReportFilterHook();
    
    const { locationOptions } = useReportConfigHook();
    const [currentTypeFilter, setCurrentTypeFilter] = useState(selectedFilter.type);
    const [currentStatusFilter, setCurrentStatusFilter] = useState(selectedFilter.status);
    const [currentCampusFilter, setCurrentCampusFilter] = useState(selectedFilter.campus);
    const [currentLocationFilter, setCurrentLocationFilter] = useState(selectedFilter.location);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    
    function applyFilter() {
        setSelectedFilter({ campus: currentCampusFilter, status: currentStatusFilter, type: currentTypeFilter, location: currentLocationFilter });
    }

    return <>
        <UseReportConfigHookEffect />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="flex justify-content-center" >
                <button className={`w-fit text-gray-600 cursor-pointer`} onClick={() => setIsOpen(true)}>
                    <i className="pi pi-filter" />
                </button>
            </div>
        </span>
        <div className={`fixed right-0 top-0 bg-black/40 w-full h-full z-100 duration-1000 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={(e) => e.currentTarget == e.target ? setIsOpen(false) : ""}>
            <div className={`flex flex-col items-center absolute right-0 top-0 bg-[#1a1d24] w-full md:w-[500px] h-full p-4 border-1 border-white md:rounded-l-xl duration-750 ${isOpen ? "translate-x-0 delay-500" : "translate-x-full delay-0"}`}>
                <div className="w-full h-full flex flex-col items-center gap-2">
                    <h1 className="text-white font-thin text-4xl border-b-1 border-white p-2 text-center w-4/5">Filter Table</h1>
                    <br />
                    <FilterItem label="Status" placeholder="Semua Status" options={Object.values(ReportStatus)} currentValue={currentStatusFilter} onChange={(newValue) => setCurrentStatusFilter(newValue)} />
                    <FilterItem label="Kategori" placeholder="Semua Kategori" options={Object.values(ReportType).map(reporttype_to_string)} currentValue={currentTypeFilter.map(reporttype_to_string)} onChange={(newValue) => setCurrentTypeFilter(newValue.map(string_to_reporttype))} />
                    <FilterItem filter={true} label="Kampus" placeholder="Semua Kampus" options={Object.values(Campus)} currentValue={currentCampusFilter} onChange={(newValue) => setCurrentCampusFilter(newValue)} />
                    <FilterItem filter={true} label="Lokasi" placeholder="Semua Lokasi" options={Object.entries(locationOptions).map(([campus, locations]) => ({ label: campus, items: locations.map((location) => ({ label: location, value: [campus, location] }))}))} optionGroupLabel="label" optionGroupChildren="items" currentValue={currentLocationFilter} onChange={(newValue) => setCurrentLocationFilter(newValue)} />
                </div>
                <button className="h-fit p-4 w-full border-white border-1 text-white cursor-pointer duration-300 hover:bg-white hover:text-[#1f324d]" onClick={applyFilter}>Apply</button>
                <button className="block md:hidden h-fit p-4 w-full border-white border-1 text-white cursor-pointer duration-300 hover:bg-white hover:text-[#1f324d] mt-2" onClick={() => setIsOpen(false)}>Close</button>
            </div>
        </div>
    </>
}


interface FilterItemProps {
    label: string,
    options: SelectItemOptionsType,
    currentValue: any[],
    onChange: (newValue: any) => void,
    optionGroupLabel?: string,
    optionGroupChildren?: string,
    placeholder?: string,
    filter?: boolean
}

function FilterItem(props: FilterItemProps) {

    return <div className="flex flex-col md:flex-row justify-between items-center w-4/5">
        <h1 className="text-xl text-white text-left w-full md:w-fit">{props.label}</h1>
        <MultiSelect filter={props.filter} display="chip" maxSelectedLabels={2} placeholder={props.placeholder} panelClassName="bg-[#1a1d24]! border! border-[#f97316]! [&_.p-multiselect-item]:hover:bg-white/40! [&_.p-multiselect-header]:bg-transparent! [&_.p-focus]:bg-transparent! **:text-white! [&_.p-highlight]:bg-white/20! [&_.p-multiselect-item-group]:bg-transparent! [&_.p-multiselect-filter]:bg-transparent! [&_.p-multiselect-filter]:border-white [&_.p-multiselect-filter]:border-1!" panelHeaderTemplate={!props.filter ? <></> : null} showSelectAll={false} showClear className="bg-transparent! w-full md:w-3/4 text-white! p-1 [&_.p-multiselect-token]:bg-white! hover:border-[#f97316]!" value={props.currentValue} onChange={(e) => props.onChange(e.value)} options={props.options} optionGroupLabel={props.optionGroupLabel} optionGroupChildren={props.optionGroupChildren} />
    </div>;
}