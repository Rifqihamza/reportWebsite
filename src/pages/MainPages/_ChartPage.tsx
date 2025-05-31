import React, { useEffect, useState, Suspense } from "react";
import strftime from "strftime";
import type { ReportData } from "../../types/variables";
import { ReportStatus, ReportType, reporttype_to_string, statusColorHex, string_to_reporttype } from '../../types/variables';
import { Dropdown } from "primereact/dropdown";
import { useReportData } from "../../hooks/shared/useReportData";

const LineChart = React.lazy(() => import("../../components/ChartLine/LineChartComponent"));
const PieChart = React.lazy(() => import("../../components/ChartPie/PieChartComponent"));
const PercenComp = React.lazy(() => import("../../components/PercenContainer/PercenContComponent"));

const listOfMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];
const listOfNumOfDates = [31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30];
const listOfDay = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const listOfHari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

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
    const { reportData } = useReportData();
    
    const [currentYearReports, setCurrentYearReports] = useState<LineChartValueType[]>([]);
    const [pieCategory, setPieCategory] = useState<CategoryType[]>([]);
    const [pieStatus, setPieStatus] = useState<CategoryType[]>([]);
    const [chartFilter, setChartFilter] = useState<LineChartFilterOption | null>(LineChartFilterOption.Year);
    const [percenCategory, setPercenCategory] = useState<CategoryType[]>([]);
    const [statusCategory, setStatusCategory] = useState<CategoryType[]>([]);
    const [chartCategoryFilter, setChartCategoryFilter] = useState<ReportType | null>(null);
    const [insight, setInsight] = useState<InsightDataType | null>(null);

    useEffect(() => {
        const result: InsightDataType = {
            totalReportAllTime: reportData.length,
            totalReportLastMonth: 0,
            totalReportThisMonth: 0,
            totalReportPerCategory: {},
            totalReportPerStatus: {},
            totalReportPerDay: {},
            totalReportPerPIC: {},
            betterThanLastMonth: null,
            highestOccuranceCategory: null,
            highestOccuranceDay: "",
            notCompletedReportPreviousMonth: 0
        };

        
        // Preparing for the result
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        Object.values(ReportType).forEach(type => {
            result.totalReportPerCategory[type] = 0;
        });
        
        Object.values(ReportStatus).forEach(status => {
            result.totalReportPerStatus[status] = 0;
        });

        listOfHari.forEach(day => {
            result.totalReportPerDay[day] = 0;
        });
        
        
        // Calculate the result
        reportData.forEach(data => {
            const report_date = new Date(data.created_at);
            
            // Report happened today
            if(report_date.getMonth() == currentMonth && report_date.getFullYear() == currentYear) {
                result.totalReportThisMonth += 1;
            }

            if((currentMonth > 1 && report_date.getMonth() == (currentMonth - 1)) || (currentMonth <= 1 && report_date.getFullYear() == currentYear - 1 && report_date.getDate() == 12)) {
                result.totalReportLastMonth += 1;
            }

            if(data.status != ReportStatus.Complete && (report_date.getMonth() < currentMonth || report_date.getFullYear() < currentYear)) {
                result.notCompletedReportPreviousMonth += 1;
            }

            if(data.pic_name) {
                if(Object.keys(result.totalReportPerPIC).includes(data.pic_name)) {
                    result.totalReportPerPIC[data.pic_name] += 1;
                }
                else {
                    result.totalReportPerPIC[data.pic_name] = 1;
                }
            }

            
            result.totalReportPerCategory[data.type]! += 1;
            result.totalReportPerStatus[data.status]! += 1;
            result.totalReportPerDay[listOfHari[new Date(data.created_at).getDay()-1]] += 1;
        });

        result.betterThanLastMonth = result.totalReportThisMonth < result.totalReportLastMonth;
        result.highestOccuranceCategory = string_to_reporttype(Object.entries(result.totalReportPerCategory).sort((category_a, category_b) => {
            return category_b[1] - category_a[1];
        })[0][0]) ?? null;
        result.highestOccuranceDay = Object.entries(result.totalReportPerDay).sort((day_a, day_b) => {
            return day_b[1] - day_a[1];
        })[0][0];

        setInsight(result);
    }, [reportData]);
    
    useEffect(() => {
        const result: LineChartValueType[] = [];
        const currentDate = new Date();
        const showedReportType = chartCategoryFilter ? [chartCategoryFilter] : Object.values(ReportType);

        if (chartFilter === LineChartFilterOption.Year) {
            listOfMonths.forEach(month => {
                showedReportType.forEach(type => {
                    result.push({
                        labels: month,
                        type: reporttype_to_string(type),
                        value: 0
                    });
                });
            });
        } else if (chartFilter === LineChartFilterOption.Month) {
            for (let i = 1; i <= listOfNumOfDates[currentDate.getMonth()]; i++) {
                showedReportType.forEach(type => {
                    result.push({
                        labels: i.toString(),
                        type: reporttype_to_string(type),
                        value: 0
                    });
                });
            }
        } else if (chartFilter === LineChartFilterOption.Week) {
            listOfDay.forEach(day => {
                showedReportType.forEach(type => {
                    result.push({
                        labels: day,
                        type: reporttype_to_string(type),
                        value: 0
                    });
                });
            });
        } else if (chartFilter === LineChartFilterOption.Today) {
            for (let hour = 0; hour < 24; hour++) {
                showedReportType.forEach(type => {
                    result.push({
                        labels: hour.toString(),
                        type: reporttype_to_string(type),
                        value: 0
                    });
                });
            }
        }

        const filtered = reportData.filter(value => {
            if (chartCategoryFilter && value.type !== chartCategoryFilter) {
                return;
            }

            const reportDate = new Date(value.created_at);
            let format = "";

            if (chartFilter === LineChartFilterOption.Today) format = "%d%m";
            else if (chartFilter === LineChartFilterOption.Month) format = "%m";
            else if (chartFilter === LineChartFilterOption.Week) format = "%W";

            format += "%y";

            return strftime(format, reportDate) === strftime(format, currentDate);
        });

        filtered.forEach(data => {
            const date = new Date(data.created_at);
            let label = "";

            if (chartFilter === LineChartFilterOption.Year) label = listOfMonths[date.getMonth()];
            else if (chartFilter === LineChartFilterOption.Month) label = date.getDate().toString();
            else if (chartFilter === LineChartFilterOption.Week) label = strftime("%a", date);
            else if (chartFilter === LineChartFilterOption.Today) label = strftime("%k", date);

            const index = result.findIndex(
                r => r.labels === label && r.type === reporttype_to_string(data.type)
            );
            if (index !== -1) result[index].value += 1;
        });

        if (chartFilter === LineChartFilterOption.Year) {
            result.sort((a, b) => listOfMonths.indexOf(a.labels) - listOfMonths.indexOf(b.labels));
        }

        setCurrentYearReports(result);
    }, [reportData, chartFilter, chartCategoryFilter]);

    useEffect(() => {
        const categoryStats: CategoryType[] = [];
        const statusStats: CategoryType[] = [];
        const percenStats: Record<string, number> = {};

        reportData.forEach(data => {
            const catLabel = data.type.toString();
            const statLabel = data.status.toString();
            const percenLabel = reporttype_to_string(data.type);

            const catIdx = categoryStats.findIndex(r => r.labels === catLabel);
            if (catIdx >= 0) categoryStats[catIdx].value += 1;
            else categoryStats.push({ labels: catLabel, value: 1 });

            const statIdx = statusStats.findIndex(r => r.labels === statLabel);
            if (statIdx >= 0) statusStats[statIdx].value += 1;
            else statusStats.push({ labels: statLabel, value: 1 });

            percenStats[percenLabel] = (percenStats[percenLabel] || 0) + 1;
        });

        const formattedPercen = Object.entries(percenStats).map(([labels, value]) => ({ labels, value }));

        setPercenCategory(formattedPercen);
        setStatusCategory(statusStats);
        setPieCategory(categoryStats);
        setPieStatus(statusStats);
    }, [reportData]);

    return (
        <div className='flex flex-col gap-4 mx-4'>
            {/* Line Chart */}
            <div className="w-full px-4 py-2 rounded-2xl border border-gray-300 bg-white shadow-inner shadow-gray-100">
                <div className="px-4 w-full flex flex-col lg:flex-row items-center justify-between">
                    <h1 className='font-bold text-center text-xl'>Grafik Laporan Temuan</h1>
                    {/* <Dropdown
                        id="chartFilter"
                        items={Object.values(LineChartFilterOption)}
                        selected={chartFilter}
                        setSelected={setChartFilter}
                    /> */}
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
                            <PieChart reports={pieCategory} setReportType={setChartCategoryFilter} reportType={chartCategoryFilter} />
                        </Suspense>
                    </div>

                    {/* Pie Chart Status */}
                    <div className="w-full px-6 py-4 text-center rounded-2xl border border-gray-300 bg-white shadow-inner shadow-gray-100 flex flex-col items-center">
                        <h1 className='font-bold'>Status</h1>
                        <Suspense fallback={<>Loading..</>}>
                            <PieChart reports={pieStatus} />
                        </Suspense>
                    </div>
                </div>

                {/* Kanan: Persen Components + Container Insight */}
                <div className="flex flex-col gap-4 w-full">
                    {/* Grid untuk 2 PersenComp */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Suspense fallback={<>Loading..</>}>
                            <PercenComp
                                reports={statusCategory}
                                label='Status'
                                icon='pi pi-exclamation-triangle'
                            />
                        </Suspense>
                        <Suspense fallback={<>Loading..</>}>
                            <PercenComp
                                reports={percenCategory}
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
                                        const sortedReportPerPICEntries = Object.entries(insight.totalReportPerPIC).sort((a, b) => b[1] - a[1]);
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
