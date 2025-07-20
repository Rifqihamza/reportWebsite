import { Accordion, AccordionTab } from "primereact/accordion"
import { Campus, campuscode_to_campus } from "../../../../types/variables";
import { LineChartTimeCategoryOption, useLineChartHook } from "../../../../hooks/pages/Statistics/useChartHook";
import { useReportConfigHook } from "../../../../hooks/shared/useReportConfig";

export default function FiltersStatistic() {
    const { chartCampusFilter, toggleChartCampusFilter } = useLineChartHook();

    const LineChartCampusFilter = (
        <>
            {Object.values(Campus).map((campus, index) => (
                <button
                    key={index}
                    className={`hover:bg-[#F2E5BF] hover:text-[#257180] p-2 rounded-2xl duration-200 w-full h-fit ${chartCampusFilter.includes(campus) ? "bg-[#F2E5BF] text-[#257180]" : "text-white bg-[#257180]"}`}
                    onClick={() => toggleChartCampusFilter(campus)}
                >
                    {campus}
                </button>
            ))}
        </>
    );

    const { chartLocationFilter, setChartLocationFilter } = useLineChartHook();
    const { locationOptions } = useReportConfigHook();

    let filteredLocations: {
        campus_name: string;
        locations: {
            location_name: string;
            location_value: [Campus, string];
        }[];
    }[] = [];

    Object.entries(locationOptions).forEach(([campus, locations]) => {
        const verified_campus = campuscode_to_campus(campus);
        if (!verified_campus || (chartCampusFilter.length > 0 && !chartCampusFilter.includes(verified_campus))) {
            return;
        }

        filteredLocations.push({
            campus_name: "Kampus " + campus,
            locations: locations.map((location) => ({
                location_name: location,
                location_value: [verified_campus, location],
            })),
        });
    });

    const { chartTimeFilter, setChartTimeCategoryFilter } = useLineChartHook();

    const LineChartTimeFilter = (
        <>
            {Object.values(LineChartTimeCategoryOption).map((timeInfo, index) => (
                <button
                    key={index}
                    className={`hover:bg-[#F2E5BF] hover:text-[#257180] p-2 rounded-2xl duration-200 w-full h-fit ${chartTimeFilter === timeInfo ? "bg-[#F2E5BF] text-[#257180]" : "text-white bg-[#257180]"}`}
                    onClick={() => setChartTimeCategoryFilter(timeInfo)}
                >
                    {timeInfo}
                </button>
            ))}
        </>
    );

    const LineChartLocationFilter = (
        <>
            {filteredLocations.map(({ campus_name, locations }, index) => (
                <div className="flex flex-col gap-2 h-fit" key={index}>
                    <h3 className="text-center text-white">{campus_name}</h3>
                    <div className="grid grid-cols-2 gap-2 h-fit">
                        {locations.map((location_data, index_2) => {
                            const locationFilterSelected = chartLocationFilter.find(
                                x => x[0] === location_data.location_value[0] && x[1] === location_data.location_value[1]
                            );
                            return (
                                <button
                                    key={index_2}
                                    className={`hover:bg-[#F2E5BF] hover:text-[#257180] p-2 rounded-2xl duration-200 w-full h-fit ${locationFilterSelected ? "bg-[#F2E5BF] text-[#257180]" : "text-white bg-[#257180]"}`}
                                    onClick={() =>
                                        locationFilterSelected
                                            ? setChartLocationFilter(chartLocationFilter.filter(
                                                value => !(value[0] === location_data.location_value[0] && value[1] === location_data.location_value[1])
                                            ))
                                            : setChartLocationFilter([...chartLocationFilter, location_data.location_value])
                                    }
                                >
                                    {location_data.location_name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </>
    );

    return (
        <Accordion>
            <AccordionTab header="Filter Kampus" className="[&_.p-accordion-content]:bg-[#257180]! [&_.p-accordion-header]:bg-[#F2E5BF]!">
                <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full mt-4">{LineChartCampusFilter}</div>
            </AccordionTab>
            <AccordionTab header="Filter Lokasi" className="[&_.p-accordion-content]:bg-[#257180]! [&_.p-accordion-header]:bg-[#F2E5BF]!">
                <div className="grid md:grid-cols-2 grid-cols-1 auto-cols-auto gap-4 w-full max-h-84 md:max-h-none overflow-auto mt-4">
                    {LineChartLocationFilter}
                </div>
            </AccordionTab>
            <AccordionTab header="Rentang Waktu" className="[&_.p-accordion-content]:bg-[#257180]! [&_.p-accordion-header]:bg-[#F2E5BF]!">
                <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full mt-4">{LineChartTimeFilter}</div>
            </AccordionTab>
        </Accordion>
    );
}
