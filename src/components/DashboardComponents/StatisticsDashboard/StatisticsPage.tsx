import React, { Suspense } from "react";
import { ReportType, reporttype_to_string, statusColorHex } from '../../../types/variables';
import { UseChartHookEffect, useInsightHook, useLineChartHook, usePercentChartHook, usePieChartHook } from "../../../hooks/pages/Statistics/useChartHook";
import UseReportDataHookEffect from "../../../hooks/shared/useReportData";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import { PrimeReactProvider } from 'primereact/api';
import UseReportConfigHookEffect from "../../../hooks/shared/useReportConfig";
import TimeChartFilter from "./filters/TimeChartFilter";
import CampusChartFilter from "./filters/CampusChartFilter";
import LocationChartFilter from "./filters/LocationChartFilter";
import ApplyFilterButton from "./filters/ApplyFilterButton";
import { Accordion, AccordionTab } from 'primereact/accordion';

const LineChart = React.lazy(() => import("./outputs/LineChartComponent"));
const PieChart = React.lazy(() => import("./outputs/PieChartComponent"));
const PercenComp = React.lazy(() => import("./outputs/PercentContComponent"));

export default function StatisticsPage() {
    const { activeTab } = useDashboardNavbarHook();
    const { lineChartCategoryFilter, percentStatus } = usePieChartHook();
    const { insight } = useInsightHook();
    const { lineChartFilteredReports } = useLineChartHook();
    const { percentCategory } = usePercentChartHook();


    if (activeTab !== 2) {
        return <></>;
    }

    return (
        <>
            <UseReportConfigHookEffect useAllCampus />
            <PrimeReactProvider>
                <div className='flex flex-col gap-4 p-4'>
                    <Accordion>
                        <AccordionTab
                            header="Filter Grafik Laporan Temuan"
                            className="[&_.p-accordion-header-link]:bg-[#CA7842]! [&_.p-accordion-header-link]:text-white! [&_.p-accordion-header-link]:rounded-2xl! [&_.p-accordion-content]:mt-3 [&_.p-accordion-content]:rounded-xl! [&_.p-accordion-content]:flex [&_.p-accordion-content]:flex-col [&_.p-accordion-content]:gap-2">                            {/* Time Filter */}
                            <TimeChartFilter />

                            {/* Campus Filter */}
                            <CampusChartFilter />

                            {/* Location Filter */}
                            <LocationChartFilter />

                            {/* Apply Filter Button */}
                            <ApplyFilterButton />
                        </AccordionTab>
                    </Accordion>

                    <div className="flex flex-col md:flex-row-reverse gap-4">
                        <div className="flex flex-col gap-4">
                            {/* Pie Chart Kategori */}
                            <div className="w-full h-fit px-2 py-5 text-center rounded-2xl flex flex-col items-center text-white bg-[#257180] shadow-md shadow-gray-400">
                                <h1 className='font-bold uppercase tracking-wider'>Kategori</h1>
                                <Suspense fallback={<>Loading..</>}>
                                    <PieChart reportType={lineChartCategoryFilter} category={true} />
                                </Suspense>
                            </div>

                            {/* Pie Chart Status */}
                            <div className="w-full h-fit px-2 py-5 text-center rounded-2xl flex flex-col items-center text-white bg-[#257180] shadow-md shadow-gray-400">
                                <h1 className='font-bold uppercase tracking-wider'>Status</h1>
                                <Suspense fallback={<>Loading..</>}>
                                    <PieChart />
                                </Suspense>
                            </div>
                        </div>
                        {/* Line Chart */}
                        <div className="flex flex-col w-full gap-4">
                            <div className="w-full h-fit px-2 py-5 rounded-2xl text-white bg-[#257180] shadow-md shadow-gray-400">
                                <div className="px-4 w-full flex flex-col items-start gap-2">
                                    <h1 className='font-bold text-xl'>Grafik Laporan Temuan</h1>
                                </div>
                                <Suspense fallback={<>Loading..</>}>
                                    <LineChart reports={lineChartFilteredReports} colors={lineChartCategoryFilter ? [statusColorHex[reporttype_to_string(lineChartCategoryFilter)]] : Object.values(ReportType).map(type => statusColorHex[reporttype_to_string(type)])} />
                                </Suspense>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                                <Suspense fallback={<>Loading..</>}>
                                    <PercenComp
                                        reports={percentStatus}
                                        label='Status'
                                    />
                                </Suspense>
                                <Suspense fallback={<>Loading..</>}>
                                    <PercenComp
                                        reports={percentCategory}
                                        label='Kategori'
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex flex-col gap-4 w-full">
                            {/* Grid untuk 2 PersenComp */}

                            {/* Container Insight di bawahnya */}
                            <div className="w-full h-full px-6 py-4 rounded-2xl flex flex-col items-center text-white bg-[#257180] shadow-md shadow-gray-400">
                                <h2 className="font-semibold uppercase tracking-wider text-lg mb-2">Insights</h2>
                                <div className="text-black">{!insight ? "Membuat insight.." :
                                    <ol className="list-decimal m-4">
                                        <li>Terdapat <b>{insight.totalReportAllTime} temuan selama ini</b> dan <b>{insight.totalReportThisMonth} diantara nya terjadi pada bulan ini.</b></li>
                                        <li>Grafik menunjukkan bahwa <b>laporan temuan bulan ini {insight.betterThanLastMonth ? "lebih sedikit" : "lebih banyak"} dari bulan sebelumnya.</b></li>
                                        <li>Selama ini, <b>Kategori {reporttype_to_string(insight.highestOccuranceCategory)} paling sering muncul</b> dibandingkan dengan kategori yang lain.</li>
                                        <li><b>Hari yang sering terjadi temuan adalah hari {insight.highestOccuranceDay}</b>.</li>
                                        <li>{insight.notCompletedReportPreviousMonth > 0 ? <>Ada <b>{insight.notCompletedReportPreviousMonth.toString() + " laporan temuan yang belum terselesaikan di bulan lalu. Itu sekitar " + (Math.round(insight.notCompletedReportPreviousMonth * 100 / (insight.totalReportAllTime - insight.totalReportThisMonth))).toString() + "% dari keseluruhan laporan!"}</b></> : <b>Semua temuan bulan lalu sudah terselesaikan semua!</b>}</li>
                                        {Object.keys(insight.totalReportPerPIC).length > 2 ?
                                            <>
                                                {(() => {
                                                    const sortedReportPerPICEntries = Object.entries(insight.totalReportPerPIC).sort((a, b) => a[1] - b[1]);
                                                    return <li>PIC dengan temuan paling sedikit adalah <b>{sortedReportPerPICEntries[0][0]}</b>. Sedangkan yang paling banyak adalah <b>{sortedReportPerPICEntries[sortedReportPerPICEntries.length - 1][0]}</b></li>
                                                })()
                                                }
                                            </> : ""}
                                    </ol>}
                                </div>
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

