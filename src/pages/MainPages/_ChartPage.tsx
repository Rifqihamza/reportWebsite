import React, { useEffect, useState, Suspense } from "react";
import strftime from "strftime";
import Dropdown from "../../components/Dropdown/DropdownComponent";
import type { ReportData } from "../../types/variables";
import { ReportType, reporttype_to_string } from "../../types/variables";

const LineChart = React.lazy(() => import("../../components/ChartLine/LineChartComponent"));
const PieChart = React.lazy(() => import("../../components/ChartPie/PieChartComponent"));
const PercenComp = React.lazy(() => import("../../components/PercenContainer/PercenContComponent"));

const listOfMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];
const listOfNumOfDates = [31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30];
const listOfDay = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type CategoryType = {
    labels: string;
    value: number;
};

type LineChartValueType = {
    labels: string;
    type: ReportType | string;
    value: number;
};

enum LineChartFilterOption {
    Year = "This Year",
    Month = "This Month",
    Week = "This Week",
    Today = "Today"
}

const GraphicChart = ({ reportData }: { reportData: ReportData[] }) => {
    const [currentYearReports, setCurrentYearReports] = useState<LineChartValueType[]>([]);
    const [pieCategory, setPieCategory] = useState<CategoryType[]>([]);
    const [pieStatus, setPieStatus] = useState<CategoryType[]>([]);
    const [chartFilter, setChartFilter] = useState<LineChartFilterOption | null>(LineChartFilterOption.Year);
    const [percenCategory, setPercenCategory] = useState<CategoryType[]>([]);
    const [statusCategory, setStatusCategory] = useState<CategoryType[]>([]);

    useEffect(() => {
        const result: LineChartValueType[] = [];
        const currentDate = new Date();

        if (chartFilter === LineChartFilterOption.Year) {
            listOfMonths.forEach(month => {
                Object.values(ReportType).forEach(type => {
                    result.push({
                        labels: month,
                        type: reporttype_to_string(type),
                        value: 0
                    });
                });
            });
        } else if (chartFilter === LineChartFilterOption.Month) {
            for (let i = 1; i <= listOfNumOfDates[currentDate.getMonth()]; i++) {
                Object.values(ReportType).forEach(type => {
                    result.push({
                        labels: i.toString(),
                        type: reporttype_to_string(type),
                        value: 0
                    });
                });
            }
        } else if (chartFilter === LineChartFilterOption.Week) {
            listOfDay.forEach(day => {
                Object.values(ReportType).forEach(type => {
                    result.push({
                        labels: day,
                        type: reporttype_to_string(type),
                        value: 0
                    });
                });
            });
        } else if (chartFilter === LineChartFilterOption.Today) {
            for (let hour = 0; hour < 24; hour++) {
                Object.values(ReportType).forEach(type => {
                    result.push({
                        labels: hour.toString(),
                        type: reporttype_to_string(type),
                        value: 0
                    });
                });
            }
        }

        const filtered = reportData.filter(value => {
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
    }, [reportData, chartFilter]);

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
        <div className='flex flex-col gap-4'>
            {/* Line Chart */}
            <div className="w-full px-4 py-2 rounded-2xl border border-gray-300 bg-white">
                <div className="px-4 w-full flex flex-col lg:flex-row items-center justify-between">
                    <h1 className='font-bold text-center text-xl'>Grafik Laporan Temuan</h1>
                    <Dropdown
                        id="chartFilter"
                        items={Object.values(LineChartFilterOption)}
                        selected={chartFilter}
                        setSelected={setChartFilter}
                    />
                </div>
                <Suspense fallback={<>Loading..</>}>
                    <LineChart reports={currentYearReports} />
                </Suspense>
            </div>

            {/* Pie Charts and Percentage Boxes */}
            <div className="w-full flex flex-col lg:flex-row gap-4 space-y-3 md:space-y-0 justify-center md:justify-between">
                {/* Pie Chart Kategori */}
                <div className="px-6 py-4 text-center rounded-2xl border border-gray-300 bg-white flex flex-col items-center">
                    <h1 className='font-bold'>Kategori</h1>
                    <Suspense fallback={<>Loading..</>}>
                        <PieChart reports={pieCategory} />
                    </Suspense>
                </div>

                {/* Pie Chart Status */}
                <div className="px-6 py-4 text-center rounded-2xl border border-gray-300 bg-white flex flex-col items-center">
                    <h1 className='font-bold'>Status</h1>
                    <Suspense fallback={<>Loading..</>}>
                        <PieChart reports={pieStatus} />
                    </Suspense>
                </div>

                {/* Percentage Status */}
                <Suspense fallback={<>Loading..</>}>
                    <PercenComp
                        reports={statusCategory}
                        label='Status'
                        icon='pi pi-exclamation-triangle'
                    />
                </Suspense>

                {/* Percentage Category */}
                <Suspense fallback={<>Loading..</>}>
                    <PercenComp
                        reports={percenCategory}
                        label='Kategori'
                        icon='pi pi-exclamation-triangle'
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default GraphicChart;
