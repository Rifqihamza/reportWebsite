import React, { Suspense } from "react";
import { Campus, ReportType, reporttype_to_string, statusColorHex } from '../../../types/variables';
import { Dropdown } from "primereact/dropdown";
import { LineChartTimeCategoryOption, UseChartHookEffect, useInsightHook, useLineChartHook, usePercentChartHook, usePieChartHook } from "../../../hooks/useChartHook";
import UseReportDataHookEffect from "../../../hooks/shared/useReportData";
import { Accordion, AccordionTab } from 'primereact/accordion';
import ChartLineCampusFilter from "../ChartLineCampusFilter/ChartLineCampusFilter";

const LineChart = React.lazy(() => import("../../DashboardComponents/ChartLine/LineChartComponent"));
const PieChart = React.lazy(() => import("../../DashboardComponents/ChartPie/PieChartComponent"));
const PercenComp = React.lazy(() => import("../../DashboardComponents/PercentContainer/PercentContComponent"));

export default function GraphicChart() {
    const { lineChartCategoryFilter: chartCategoryFilter, percentStatus } = usePieChartHook();
    const { insight } = useInsightHook();
    const { lineChartFilteredReports, chartTimeCategoryFilter, setChartTimeCategoryFilter } = useLineChartHook();
    const { percentCategory } = usePercentChartHook();
    const options = Object.values(LineChartTimeCategoryOption);

    return (
        <>
            <UseReportDataHookEffect />
            <UseChartHookEffect />
            <div className='flex flex-col gap-4 mx-4'>
                {/* Time selection */}
                <div className="md:hidden block w-full">
                    <Dropdown
                        className="px-4 py-2 rounded-xl! [&_.p-dropdown-label]:text-[#1f324d]! [&_.p-dropdown-trigger]:text-[#1f324d]! bg-white! [&_.p-dropdown]:bg-white! [&_.p-dropdown-label]:bg-white! [&_.p-dropdown-trigger]:bg-white! md:[&_.p-dropdown-label]:text-white! md:[&_.p-dropdown-trigger]:text-white! md:bg-[#1f324d]! md:[&_.p-dropdown]:bg-[#1f324d]! md:[&_.p-dropdown-label]:bg-[#1f324d]! md:[&_.p-dropdown-trigger]:bg-[#1f324d]!"
                        value={chartTimeCategoryFilter}
                        onChange={(e) => setChartTimeCategoryFilter(e.value)}
                        options={Object.values(LineChartTimeCategoryOption)} />
                </div>
                <div className="w-full hidden md:flex md:flex-row md:justify-between md:gap-3 bg-white px-4 py-3 rounded-2xl">
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => setChartTimeCategoryFilter(option)}
                            className={`p-4 rounded-lg w-full ${chartTimeCategoryFilter === option ? 'bg-[#1f324d] text-white' : 'bg-gray-200 hover:bg-[#1f324d]/20 text-black'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                {/* Chart campus filter */}
                <div className="md:hidden block w-full">
                    <Accordion>
                        <AccordionTab header="Campus Filter">
                            <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full">
                                <ChartLineCampusFilter />
                            </div>
                        </AccordionTab>
                    </Accordion>
                </div>
                <div className="md:flex hidden flex-row gap-4 p-4 bg-white justify-between">
                    <ChartLineCampusFilter />
                </div>
                
                {/* Line Chart */}
                <div className="w-full px-4 py-2 rounded-2xl bg-white shadow">
                    <div className="px-4 w-full flex flex-col items-start gap-2">
                        <h1 className='font-bold text-xl'>Grafik Laporan Temuan</h1>
                    </div>
                    <Suspense fallback={<>Loading..</>}>
                        <LineChart reports={lineChartFilteredReports} colors={chartCategoryFilter ? [statusColorHex[reporttype_to_string(chartCategoryFilter)]] : Object.values(ReportType).map(type => statusColorHex[reporttype_to_string(type)])} />
                    </Suspense>
                </div>

                {/* Pie Charts and Percentage Boxes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                    {/* Kiri: Pie Chart Kategori dan Status */}
                    <div className="flex flex-col gap-4">
                        {/* Pie Chart Kategori */}
                        <div className="w-full h-full px-6 py-4 text-center rounded-2xl flex flex-col items-center bg-white shadow">
                            <h1 className='font-bold uppercase tracking-wider'>Kategori</h1>
                            <Suspense fallback={<>Loading..</>}>
                                <PieChart reportType={chartCategoryFilter} category={true} />
                            </Suspense>
                        </div>

                        {/* Pie Chart Status */}
                        <div className="w-full h-full px-6 py-4 text-center rounded-2xl flex flex-col items-center bg-white shadow">
                            <h1 className='font-bold uppercase tracking-wider'>Status</h1>
                            <Suspense fallback={<>Loading..</>}>
                                <PieChart />
                            </Suspense>
                        </div>
                    </div>

                    {/* Kanan: Persen Components + Container Insight */}
                    <div className="flex flex-col gap-4 w-full">
                        {/* Grid untuk 2 PersenComp */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        {/* Container Insight di bawahnya */}
                        <div className="w-full h-full px-6 py-4 rounded-2xl flex flex-col items-center bg-white shadow">
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
        </>
    );
};

