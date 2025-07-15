import React, { Suspense } from "react";
import { ReportType, reporttype_to_string, statusColorHex } from '../../../types/variables';
import { UseChartHookEffect, useInsightHook, useLineChartHook, usePercentChartHook, usePieChartHook } from "../../../hooks/pages/Statistics/useChartHook";
import UseReportDataHookEffect from "../../../hooks/shared/useReportData";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import { PrimeReactProvider } from 'primereact/api';
import UseReportConfigHookEffect from "../../../hooks/shared/useReportConfig";
import ApplyFilterButton from "./filters/ApplyFilterButton";
import { Accordion, AccordionTab } from 'primereact/accordion';
import FiltersStatistic from "./filters/FilterStatistic";

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
                <div className='flex flex-col gap-4 px-2 py-3 h-full w-full'>
                    <Accordion className="
                            [&_.p-accordion-header]:p-2!
                            [&_.p-accordion-header]:mt-2!
                            [&_.p-accordion-header]:rounded-xl!
                            [&_.p-accordion-header-link]:border-none!
                            [&_.p-accordion-header-link]:bg-transparent!
                            [&_.p-accordion-header]:bg-[#257180]!
                            [&_.p-accordion-header-link]:text-white!
                    ">
                        <AccordionTab
                            header="Filter Grafik Laporan Temuan"
                            className="
                            [&_.p-accordion-content]:flex
                            [&_.p-accordion-content]:flex-col
                            [&_.p-accordion-content]:gap-2
                            [&_.p-accordion-content]:mt-2
                            [&_.p-accordion-content]:border-none!
                            [&_.p-accordion-content]:rounded-xl!
                            [&_.p-accordion-header-link]:p-2!
                            [&_.p-accordion-content]:bg-[#CB6040]!
                            ">
                            <FiltersStatistic />
                            <ApplyFilterButton />
                        </AccordionTab>
                    </Accordion>
                    {/* Container */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Container Chart */}
                        <div className="flex-3 flex flex-col w-full gap-4">
                            {/* Line Chart */}
                            <div className="px-2 py-5 rounded-2xl bg-[#CB6040] shadow-md shadow-white">
                                <div className="px-4 w-full flex flex-col items-start gap-2">
                                    <h1 className='font-bold text-xl text-white'>Grafik Laporan Temuan</h1>
                                </div>
                                <Suspense fallback={<>Loading..</>}>
                                    <LineChart reports={lineChartFilteredReports} colors={lineChartCategoryFilter ? [statusColorHex[reporttype_to_string(lineChartCategoryFilter)]] : Object.values(ReportType).map(type => statusColorHex[reporttype_to_string(type)])} />
                                </Suspense>
                            </div>
                            {/* Pie Chart */}
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Pie Chart Kategori */}
                                <div className="w-full px-2 py-5 text-center rounded-2xl flex flex-col items-center bg-[#CB6040] shadow-md shadow-white">
                                    <h1 className='font-bold uppercase tracking-wider text-white'>Kategori</h1>
                                    <Suspense fallback={<>Loading..</>}>
                                        <PieChart reportType={lineChartCategoryFilter} category={true} />
                                    </Suspense>
                                </div>

                                {/* Pie Chart Status */}
                                <div className="w-full px-2 py-5 text-center rounded-2xl flex flex-col items-center bg-[#CB6040] shadow-md shadow-white">
                                    <h1 className='font-bold uppercase tracking-wider text-white'>Status</h1>
                                    <Suspense fallback={<>Loading..</>}>
                                        <PieChart />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-4 w-full h-full">
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
                    {/* Container Insight */}
                    <div className="w-full pb-3">
                        <div className="w-full h-full px-6 py-4 rounded-2xl flex flex-col items-center bg-[#CB6040] shadow-md shadow-white text-white">
                            <h2 className="font-semibold uppercase tracking-wider text-lg mb-2">Insights</h2>
                            <div className="">{!insight ? "Memuat insight.." :
                                <ol className="list-decimal p-2 space-y-3">
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
            </PrimeReactProvider>
            <UseReportDataHookEffect />
            <UseChartHookEffect />
        </>
    );
};

