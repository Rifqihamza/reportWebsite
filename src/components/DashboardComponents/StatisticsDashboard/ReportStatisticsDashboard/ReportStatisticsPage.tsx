import React, { Suspense } from "react";
import { ReportType, reporttype_to_string, statusColorHex } from '../../../../types/variables';
import { UseChartHookEffect, useInsightHook, useLineChartHook, usePercentChartHook, usePieChartHook } from "../../../../hooks/pages/Statistics/useChartHook";
import UseReportDataHookEffect from "../../../../hooks/shared/useReportData";
import { useDashboardNavbarHook } from "../../../../hooks/shared/useDashboardNavbar";
import { PrimeReactProvider } from 'primereact/api';
import UseReportConfigHookEffect from "../../../../hooks/shared/useReportConfig";
import TimeChartFilter from "./filters/TimeChartFilter";
import CampusChartFilter from "./filters/CampusChartFilter";
import LocationChartFilter from "./filters/LocationChartFilter";
import ApplyFilterButton from "./filters/ApplyFilterButton";
import { Accordion, AccordionTab } from 'primereact/accordion';
import InsightsComponent from "./outputs/InsightsComponent";

const LineChartComponent = React.lazy(() => import("./outputs/LineChartComponent"));
const PieChartComponent = React.lazy(() => import("./outputs/PieChartComponent"));
const PercenComponent = React.lazy(() => import("./outputs/PercentContComponent"));

export default function StatisticsPage() {
    const { activeTab } = useDashboardNavbarHook();
    const { lineChartCategoryFilter, pieCategory, pieStatus } = usePieChartHook();
    const { lineChartFilteredReports } = useLineChartHook();
    const { percentCategory, percentStatus } = usePercentChartHook();


    if(activeTab !== 2) {
        return <></>;
    }

    return (
        <>
            <UseReportConfigHookEffect useAllCampus />
            <PrimeReactProvider>
                <div className='flex flex-col gap-4 mx-4 mt-2'>
                    <h1 className="text-3xl text-white">Report Statistics</h1>
                    <Accordion>
                        <AccordionTab header="Filter Grafik Laporan Temuan" className="[&_.p-accordion-header-link]:bg-[#2b3440]! [&_>.p-accordion-header-link]:rounded-xl! [&_.p-accordion-header-link]:text-white! [&_>.p-accordion-header-link]:border-1! [&_.p-accordion-header-link]:z-12 [&_a.p-accordion-header-link]:bg-[#2b3440]! [&_.>p-accordion-content]:z-10 [&_>.p-accordion-content]:-translate-y-2 [&_.p-accordion-content]:bg-[#222]! [&_.p-accordion-content]:flex [&_.p-accordion-content]:flex-col [&_.p-accordion-content]:gap-2">
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

                    {/* Line Chart */}
                    <div className="w-full px-4 pb-2 pt-6 rounded-2xl bg-[#2b3440] border border-white shadow">
                        <div className="px-4 w-full flex flex-col items-start gap-2">
                            <h1 className='font-bold text-xl text-white'>Grafik Laporan Temuan</h1>
                        </div>
                        <Suspense fallback={<>Loading..</>}>
                            <LineChartComponent reports={lineChartFilteredReports} colors={lineChartCategoryFilter ? [statusColorHex[reporttype_to_string(lineChartCategoryFilter)]] : Object.values(ReportType).map(type => statusColorHex[reporttype_to_string(type)])} />
                        </Suspense>
                    </div>

                    {/* Pie Charts and Percentage Boxes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                        {/* Kiri: Pie Chart Kategori dan Status */}
                        <div className="flex flex-col gap-4">
                            {/* Pie Chart Kategori */}
                            <div className="w-full h-full px-6 py-4 text-center rounded-2xl flex flex-col items-center **:text-white! border border-white bg-[#2b3440] shadow">
                                <h1 className='font-bold uppercase tracking-wider'>Kategori</h1>
                                <Suspense fallback={<>Loading..</>}>
                                    <PieChartComponent pieData={pieCategory} />
                                </Suspense>
                            </div>

                            {/* Pie Chart Status */}
                            <div className="w-full h-full px-6 py-4 text-center rounded-2xl flex flex-col items-center **:text-white! border border-white bg-[#2b3440] shadow">
                                <h1 className='font-bold uppercase tracking-wider'>Status</h1>
                                <Suspense fallback={<>Loading..</>}>
                                    <PieChartComponent pieData={pieStatus} />
                                </Suspense>
                            </div>
                        </div>

                        {/* Kanan: Persen Components + Container Insight */}
                        <div className="flex flex-col gap-4 w-full">
                            {/* Grid untuk 2 PersenComp */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Suspense fallback={<>Loading..</>}>
                                    <PercenComponent
                                        reports={percentStatus}
                                        label='Status'
                                    />
                                </Suspense>
                                <Suspense fallback={<>Loading..</>}>
                                    <PercenComponent
                                        reports={percentCategory}
                                        label='Kategori'
                                    />
                                </Suspense>
                            </div>

                            {/* Container Insight di bawahnya */}
                            <div className="w-full h-full px-6 py-4 rounded-2xl flex flex-col items-center bg-[#2b3440] border border-white shadow">
                                <h2 className="text-white font-semibold uppercase tracking-wider text-md mb-2">Insights</h2>
                                <InsightsComponent />
                            </div>
                        </div>
                    </div>

                </div>
            </PrimeReactProvider>
            <UseReportDataHookEffect />
            <UseChartHookEffect />
        </>
    );
};

