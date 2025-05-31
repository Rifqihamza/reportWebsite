import React, { useEffect, useState, Suspense } from "react";
import strftime from "strftime";
import type { ReportData } from "../../types/variables";
import { ReportStatus, ReportType, reporttype_to_string, statusColorHex, string_to_reporttype } from '../../types/variables';
import { Dropdown } from "primereact/dropdown";
import { useReportDataHook } from "../../hooks/shared/useReportData";
import { UseChartHookEffect, useInsightHook, usePieChartHook } from "../../hooks/useChartHook";

const LineChart = React.lazy(() => import("../../components/ChartLine/LineChartComponent"));
const PieChart = React.lazy(() => import("../../components/ChartPie/PieChartComponent"));
const PercenComp = React.lazy(() => import("../../components/PercenContainer/PercenContComponent"));


type CategoryType = {
    labels: string;
    value: number;
};

type LineChartValueType = {
    labels: string;
    type: ReportType | string;
    value: number;
};

type InsightDataType = {
    totalReportAllTime: number,
    totalReportLastMonth: number,
    totalReportThisMonth: number,
    totalReportPerCategory: {
        [key in ReportType]?: number
    },
    totalReportPerStatus: {
        [key in ReportStatus]?: number
    },
    totalReportPerDay: {
        [key: string]: number
    },
    totalReportPerPIC: {
        [key: string]: number
    },
    betterThanLastMonth: boolean|null,
    highestOccuranceCategory: ReportType|null,
    highestOccuranceDay: string,
    notCompletedReportPreviousMonth: number,
};

enum LineChartFilterOption {
    Year = "This Year",
    Month = "This Month",
    Week = "This Week",
    Today = "Today"
}

const GraphicChart = () => {
    const { reportData } = useReportDataHook();
    
    const [currentYearReports, setCurrentYearReports] = useState<LineChartValueType[]>([]);
    const [chartFilter, setChartFilter] = useState<LineChartFilterOption | null>(LineChartFilterOption.Year);
    const [percentCategory, setPercentCategory] = useState<CategoryType[]>([]);

    const { lineChartCategoryFilter: chartCategoryFilter, percentStatus, setPercentStatus, setPieCategory, setPieStatus } = usePieChartHook();
    const { insight, setInsight } = useInsightHook();

    return (
        <div className='flex flex-col gap-4 mx-4'>
            <UseChartHookEffect />
            {/* Line Chart */}
            <div className="w-full px-4 py-2 rounded-2xl border border-gray-300 bg-white shadow-inner shadow-gray-100">
                <div className="px-4 w-full flex flex-col lg:flex-row items-center justify-between">
                    <h1 className='font-bold text-center text-xl'>Grafik Laporan Temuan</h1>
                    <Dropdown className="[&_.p-dropdown-label]:text-white" value={chartFilter} onChange={(e) => setChartFilter(e.value)} options={Object.values(LineChartFilterOption)}  />
                </div>
                <Suspense fallback={<>Loading..</>}>
                    <LineChart reports={currentYearReports} colors={chartCategoryFilter ? [statusColorHex[reporttype_to_string(chartCategoryFilter)]] : Object.values(ReportType).map(type => statusColorHex[reporttype_to_string(type)])} />
                </Suspense>
            </div>

            {/* Pie Charts and Percentage Boxes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                {/* Kiri: Pie Chart Kategori dan Status */}
                <div className="flex flex-col gap-4">
                    {/* Pie Chart Kategori */}
                    <div className="w-full h-full px-6 py-4 text-center rounded-2xl border border-gray-300 bg-white shadow-inner shadow-gray-100 flex flex-col items-center">
                        <h1 className='font-bold'>Kategori</h1>
                        <Suspense fallback={<>Loading..</>}>
                            <PieChart reportType={chartCategoryFilter} />
                        </Suspense>
                    </div>

                    {/* Pie Chart Status */}
                    <div className="w-full px-6 py-4 text-center rounded-2xl border border-gray-300 bg-white shadow-inner shadow-gray-100 flex flex-col items-center">
                        <h1 className='font-bold'>Status</h1>
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
                                icon='pi pi-exclamation-triangle'
                            />
                        </Suspense>
                        <Suspense fallback={<>Loading..</>}>
                            <PercenComp
                                reports={percentCategory}
                                label='Kategori'
                                icon='pi pi-exclamation-triangle'
                            />
                        </Suspense>
                    </div>

                    {/* Container Insight di bawahnya */}
                    <div className="w-full h-full px-4 py-6 rounded-2xl border border-gray-300 bg-white shadow-inner shadow-gray-100">
                        <h2 className="font-semibold text-lg mb-2">Insights</h2>
                        <div className="text-gray-600">{!insight ? "Membuat insight.." : 
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
                                </>:""}
                            </ol>}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default GraphicChart;
