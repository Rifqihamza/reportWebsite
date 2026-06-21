import { Accordion } from "@mui/material";
import { AccordionTab } from "primereact/accordion";
import { PrimeReactProvider } from "primereact/api";
import TimeChartFilter from "./filters/TimeChartFilter";
import CampusChartFilter from "./filters/CampusChartFilter";
import LocationChartFilter from "./filters/LocationChartFilter";
import ApplyFilterButton from "./filters/ApplyFilterButton";

export default function ReportFilterContainer() {
  return (
    <PrimeReactProvider>
      <Accordion>
        <AccordionTab
          header="Filter Grafik Laporan Temuan"
          className="[&_.p-accordion-header-link]:bg-[#2b3440]! [&_>.p-accordion-header-link]:rounded-xl! [&_.p-accordion-header-link]:text-white! [&_>.p-accordion-header-link]:border! [&_.p-accordion-header-link]:z-12 [&_a.p-accordion-header-link]:bg-[#2b3440]! [&_>p-accordion-content]:z-10 [&_>.p-accordion-content]:-translate-y-2 [&_.p-accordion-content]:bg-[#222]! [&_.p-accordion-content]:flex [&_.p-accordion-content]:flex-col [&_.p-accordion-content]:gap-2"
        >
          {/* Time Filter */}
          <TimeChartFilter />

          {/* Campus Filter */}
          <CampusChartFilter />

          {/* Location Filter */}
          <LocationChartFilter />

          {/* Apply Filter Button */}
          <ApplyFilterButton />
        </AccordionTab>
      </Accordion>
    </PrimeReactProvider>
  );
}
