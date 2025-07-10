import { useLineChartHook } from "../../../../hooks/pages/Statistics/useChartHook";
import { useReportConfigHook } from "../../../../hooks/shared/useReportConfig";
import { Campus, campuscode_to_campus } from "../../../../types/variables";
import { Accordion, AccordionTab } from "primereact/accordion";

export default function LocationChartFilter() {
  const { chartCampusFilter, chartLocationFilter, setChartLocationFilter } = useLineChartHook();
  const { locationOptions } = useReportConfigHook();

  let filteredLocations: {
    campus_name: string;
    locations: {
      location_name: string;
      location_value: [Campus, string];
    }[];
  }[] = [];

  Object.entries(locationOptions).forEach(([campus, locations], index) => {
    const verified_campus = campuscode_to_campus(campus);
    if (!verified_campus || (chartCampusFilter.length > 0 && !chartCampusFilter.includes(verified_campus))) {
      return;
    }

    filteredLocations.push({
      campus_name: "Kampus " + campus,
      locations: [],
    });

    filteredLocations[filteredLocations.length - 1].locations = locations.map((location) => ({
      location_name: location,
      location_value: [verified_campus, location],
    }));
  });
  
  const LineChartLocationFilter = <>{filteredLocations.map(({campus_name, locations}, index) => {
    return <div className="flex flex-col gap-2 h-fit" key={index}>
      <h3 className="text-center">{campus_name}</h3>
      <div className="grid grid-cols-2 gap-2 h-fit">
        {locations.map((location_data, index_2) => {
          const locationFilterSelected = chartLocationFilter.find(x => (x[0] == location_data.location_value[0] && x[1] == location_data.location_value[1]));
          return <button 
                    key={index_2} 
                    className={`hover:bg-gray-500 p-4 rounded-2xl duration-200 w-full border-2 border-[#1f324d] ${locationFilterSelected ? "bg-[#1f324d]! text-white!" : ""}`} 
                    onClick={() => locationFilterSelected ? setChartLocationFilter(chartLocationFilter.filter((value) => !(value[0] === location_data.location_value[0] && value[1] === location_data.location_value[1]))) : setChartLocationFilter([...chartLocationFilter, location_data.location_value])}
                  >
                    {location_data.location_name}
                  </button>
        })}
      </div>
    </div>
  })}</>;

  return (
    <>
      <div>
        <Accordion>
          <AccordionTab
            header="Filter Lokasi"
            className="[&_.p-accordion-header-link]:bg-white! [&_.p-accordion-header-link]:border-0! [&_.p-accordion-header-link]:rounded-lg! [&.p-toggleable-content]:rounded-b-lg! [&.p-toggleable-content]:border-1! [&.p-toggleable-content]:border-white! [&.p-toggleable-content]:*:rounded-b-lg! [&.p-toggleable-content]:-translate-y-4"
          >
            <div className="grid md:grid-cols-2 grid-cols-1 auto-cols-auto gap-4 w-full max-h-84 md:max-h-none overflow-auto mt-4">{LineChartLocationFilter}</div>
          </AccordionTab>
        </Accordion>
      </div>
    </>
  );
}
