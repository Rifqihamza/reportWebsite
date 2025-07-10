import { Accordion, AccordionTab } from "primereact/accordion";
import { ListBox } from "primereact/listbox";
import { useLineChartHook } from "../../../../hooks/pages/Statistics/useChartHook";
import { useReportConfigHook } from "../../../../hooks/shared/useReportConfig";
import { Campus, campuscode_to_campus } from "../../../../types/variables";
import { LineChartTimeCategoryOption } from "../../../../hooks/pages/Statistics/useChartHook";

export default function FiltersWrapper() {
    const {
        chartCampusFilter,
        toggleChartCampusFilter,
        chartLocationFilter,
        setChartLocationFilter,
        chartTimeFilter,
        setChartTimeCategoryFilter
    } = useLineChartHook();

    const { locationOptions } = useReportConfigHook();

    // CAMPUS OPTIONS
    const campusOptions = Object.values(Campus).map(campus => ({
        label: campus,
        value: campus
    }));

    // LOCATION OPTIONS
    const locationGroupOptions = Object.entries(locationOptions)
        .map(([campusCode, locations]) => {
            const verifiedCampus = campuscode_to_campus(campusCode);
            if (!verifiedCampus || (chartCampusFilter.length > 0 && !chartCampusFilter.includes(verifiedCampus))) {
                return null;
            }
            return {
                label: `Kampus ${campusCode}`,
                items: locations.map(location => ({
                    label: location,
                    value: [verifiedCampus, location] as [Campus, string]
                }))
            };
        })
        .filter(Boolean) as { label: string; items: { label: string; value: [Campus, string] }[] }[];

    // TIME OPTIONS
    const timeOptions = Object.values(LineChartTimeCategoryOption).map(time => ({
        label: time,
        value: time
    }));

    return (
        <div className="w-full">
            <Accordion className=" [&_.p-accordion-header-link]:rounded-xl! [&_.p-accordion-header-link]:bg-[#fff]! [&_.p-accordion-header-link]:text-[#1f324d]! [&_.p-accordion-content]:rounded-xl! [&_.p-accordion-content]:border-none!">
                <AccordionTab header="Filter Statistik" className="w-full [&_.p-accordion-content]:bg-transparent! [&_.p-accordion-content]:border-none! ">
                    <Accordion multiple className="flex flex-row gap-3 [&_.p-accordion-content]:bg-transparent! [&_.p-accordion-header-link]:rounded-xl! [&_.p-accordion-header-link]:bg-[#fff]! [&_.p-accordion-header-link]:text-[#1f324d]! [&_.p-accordion-content]:rounded-xl! [&_.p-accordion-content]:border-none!">
                        {/* Campus Filter */}
                        <AccordionTab header="Filter Campus">
                            <ListBox
                                value={chartCampusFilter}
                                options={campusOptions}
                                multiple
                                onChange={(e) => toggleChartCampusFilter(e.value)}
                                className="w-full"
                            />
                        </AccordionTab>

                        {/* Location Filter */}
                        <AccordionTab header="Filter Locaation">
                            <ListBox
                                value={chartLocationFilter}
                                options={locationGroupOptions}
                                optionGroupLabel="label"
                                optionGroupChildren="items"
                                multiple
                                onChange={(e) => setChartLocationFilter(e.value)}
                                className="w-full"
                            />
                        </AccordionTab>

                        {/* Time Range Filter */}
                        <AccordionTab header="Rentang Range Time">
                            <ListBox
                                value={chartTimeFilter}
                                options={timeOptions}
                                onChange={(e) => setChartTimeCategoryFilter(e.value)}
                                className="w-full"
                            />
                        </AccordionTab>

                    </Accordion>

                </AccordionTab>
            </Accordion>
        </div>
    );
}
