import { MultiSelect } from "primereact/multiselect";
import { useLineChartHook } from "../../../../hooks/useChartHook";
import { useReportConfigHook } from "../../../../hooks/useReportConfig";
import { Campus, campuscode_to_campus } from "../../../../types/variables";

export default function LocationChartFilter() {
  const { chartCampusFilter, chartLocationFilter, setChartLocationFilter } = useLineChartHook();
  const { locationOptions } = useReportConfigHook();
  
  return (
    <>
      <div>
        <MultiSelect
          value={chartLocationFilter}
          onChange={(e) => {
            setChartLocationFilter(e.value);
          }}
          options={(() => {
            let filteredLocations: {
              campus_name: string;
              locations: {
                location_name: string;
                location_value: [Campus, string];
              }[];
            }[] = [];

            Object.entries(locationOptions).forEach(([campus, locations], index) => {
              const verified_campus = campuscode_to_campus(campus);
              if (!verified_campus || !chartCampusFilter.includes(verified_campus)) {
                return;
              }

              filteredLocations.push({
                campus_name: "Kampus " + campus,
                locations: [],
              });

              filteredLocations[filteredLocations.length - 1].locations = locations.map((location) => ({
                location_name: `${location} (${campus})`,
                location_value: [verified_campus, location],
              }));
            });

            return filteredLocations;
          })()}
          optionGroupChildren="locations"
          optionGroupLabel="campus_name"
          optionLabel="location_name"
          optionValue="location_value"
          display="chip"
          className="w-full rounded-lg!"
          placeholder="Filter lokasi..."
          filter
        />
      </div>
    </>
  );
}
