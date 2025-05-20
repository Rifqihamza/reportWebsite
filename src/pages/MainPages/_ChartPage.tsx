<<<<<<< HEAD:src/pages/MainPages/ChartPage.tsx
=======
import BarChartIcon from '@mui/icons-material/BarChart';
>>>>>>> 5ffd7a0dd3a3a666c602cf3f4ae4e7d9a7fa51d8:src/pages/MainPages/_ChartPage.tsx
import React, { useEffect, useState } from "react";
import type { ReportData } from "../../types/variables";
import { ReportType, reporttype_to_string } from '../../types/variables';
import { Suspense } from "react";
import strftime from "strftime";
import Dropdown from "../../components/Dropdown/DropdownComponent";



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
}

enum LineChartFilterOption {
    Year = "This Year",
    Month = "This Month",
    Week = "This Week",
    Today = "Today"
}

const GraphicChart = ({ reportData }: { reportData: ReportData[] }) => {
    const [currentYearReports, setCurrentYearReports] = useState([] as LineChartValueType[]);
    const [pieCategory, setPieCategory] = useState([] as CategoryType[]);
    const [pieStatus, setPieStatus] = useState([] as CategoryType[]);
    const [chartFilter, setChartFilter] = useState(LineChartFilterOption.Year as LineChartFilterOption | null);
    const [percenCategory, setPercenCategory] = useState<CategoryType[]>([]);
    const [statusCategory, setStatusCategory] = useState<CategoryType[]>([]);
<<<<<<< HEAD:src/pages/MainPages/ChartPage.tsx

=======
    
>>>>>>> 5ffd7a0dd3a3a666c602cf3f4ae4e7d9a7fa51d8:src/pages/MainPages/_ChartPage.tsx
    useEffect(() => {
        // Generate line chart data
        let result: LineChartValueType[] = [];
        const currentDate = new Date();

<<<<<<< HEAD:src/pages/MainPages/ChartPage.tsx
        if (chartFilter == LineChartFilterOption.Year) {
=======
        if(chartFilter == LineChartFilterOption.Year) {
>>>>>>> 5ffd7a0dd3a3a666c602cf3f4ae4e7d9a7fa51d8:src/pages/MainPages/_ChartPage.tsx
            listOfMonths.forEach(value => {
                Object.values(ReportType).map(reportType => {
                    result.push({
                        labels: value,
                        type: reporttype_to_string(reportType),
                        value: 0
                    });
                });
            });
        }
<<<<<<< HEAD:src/pages/MainPages/ChartPage.tsx
        else if (chartFilter == LineChartFilterOption.Month) {
=======
        else if(chartFilter == LineChartFilterOption.Month) {
>>>>>>> 5ffd7a0dd3a3a666c602cf3f4ae4e7d9a7fa51d8:src/pages/MainPages/_ChartPage.tsx
            for (let index = 1; index <= listOfNumOfDates[currentDate.getMonth()]; index++) {
                Object.values(ReportType).map(reportType => {
                    result.push({
                        labels: index.toString(),
                        type: reporttype_to_string(reportType),
                        value: 0
                    });
                });
            }
        }
<<<<<<< HEAD:src/pages/MainPages/ChartPage.tsx
        else if (chartFilter == LineChartFilterOption.Week) {
=======
        else if(chartFilter == LineChartFilterOption.Week) {
>>>>>>> 5ffd7a0dd3a3a666c602cf3f4ae4e7d9a7fa51d8:src/pages/MainPages/_ChartPage.tsx
            listOfDay.forEach(day => {
                Object.values(ReportType).map(reportType => {
                    result.push({
                        labels: day,
                        type: reporttype_to_string(reportType),
                        value: 0
                    });
                });
            });
        }
<<<<<<< HEAD:src/pages/MainPages/ChartPage.tsx
        else if (chartFilter == LineChartFilterOption.Today) {
=======
        else if(chartFilter == LineChartFilterOption.Today) {
>>>>>>> 5ffd7a0dd3a3a666c602cf3f4ae4e7d9a7fa51d8:src/pages/MainPages/_ChartPage.tsx
            for (let hour = 0; hour < 24; hour++) {
                Object.values(ReportType).map(reportType => {
                    result.push({
                        labels: hour.toString(),
                        type: reporttype_to_string(reportType),
                        value: 0
                    });
                });
            }
        }
<<<<<<< HEAD:src/pages/MainPages/ChartPage.tsx

=======
        
>>>>>>> 5ffd7a0dd3a3a666c602cf3f4ae4e7d9a7fa51d8:src/pages/MainPages/_ChartPage.tsx
        reportData.filter(value => {
            const reportDate = new Date(value.created_at);
            let result_format = "";

<<<<<<< HEAD:src/pages/MainPages/ChartPage.tsx
            if (chartFilter == LineChartFilterOption.Today) {
                result_format += "%d%m";
            }
            else if (chartFilter == LineChartFilterOption.Month) {
                result_format += "%m";
            }
            else if (chartFilter == LineChartFilterOption.Week) {
=======
            if(chartFilter == LineChartFilterOption.Today) {
                result_format += "%d%m";
            }
            else if(chartFilter == LineChartFilterOption.Month) {
                result_format += "%m";
            }
            else if(chartFilter == LineChartFilterOption.Week) {
>>>>>>> 5ffd7a0dd3a3a666c602cf3f4ae4e7d9a7fa51d8:src/pages/MainPages/_ChartPage.tsx
                result_format = "%W";
            }

            result_format += "%y";

            return strftime(result_format, reportDate) == strftime(result_format, currentDate);
        }).forEach(data => {
            let date = new Date(data.created_at);
            let label = "";
<<<<<<< HEAD:src/pages/MainPages/ChartPage.tsx
            if (chartFilter == LineChartFilterOption.Year) {
                label = listOfMonths[date.getMonth()];
            }
            else if (chartFilter == LineChartFilterOption.Month) {
                label = date.getDate().toString();
            }
            else if (chartFilter == LineChartFilterOption.Week) {
                label = strftime("%a", date);
            }
            else if (chartFilter == LineChartFilterOption.Today) {
=======
            if(chartFilter == LineChartFilterOption.Year) {
                label = listOfMonths[date.getMonth()];
            }
            else if(chartFilter == LineChartFilterOption.Month) {
                label = date.getDate().toString();
            }
            else if(chartFilter == LineChartFilterOption.Week) {
                label = strftime("%a", date);
            }
            else if(chartFilter == LineChartFilterOption.Today) {
>>>>>>> 5ffd7a0dd3a3a666c602cf3f4ae4e7d9a7fa51d8:src/pages/MainPages/_ChartPage.tsx
                label = strftime("%k", date);
            }

            let index = result.findIndex(value => value.labels == label && value.type == reporttype_to_string(data.type));
<<<<<<< HEAD:src/pages/MainPages/ChartPage.tsx
            if (index != -1) {
=======
            if(index != -1) {
>>>>>>> 5ffd7a0dd3a3a666c602cf3f4ae4e7d9a7fa51d8:src/pages/MainPages/_ChartPage.tsx
                result[index].value += 1;
            }
        })

        result.sort((a, b) => listOfMonths.indexOf(a.labels) - listOfMonths.indexOf(b.labels));

        setCurrentYearReports(result);
    }, [reportData, chartFilter]);

    useEffect(() => {
        // Get the category and status statistics
        let categoryStats: CategoryType[] = [];
        let statusStats: CategoryType[] = [];
        let percenStats: Record<string, number> = {};

        reportData.forEach(data => {
            let index = categoryStats.findIndex(res_data => res_data.labels == data.type.toString());
            if (index < 0) {
                categoryStats.push({
                    labels: data.type.toString(),
                    value: 1
                });
            }
            else {
                categoryStats[index].value += 1;
            }

            index = statusStats.findIndex(res_data => res_data.labels == data.status.toString());
            if (index < 0) {
                statusStats.push({
                    labels: data.status.toString(),
                    value: 1
                });
            }
            else {
                statusStats[index].value += 1;
            }

            const percenLabel = reporttype_to_string(data.type);
            percenStats[percenLabel] = (percenStats[percenLabel] || 0) + 1;

        });

        const formattedCategoryPercen = Object.entries(percenStats).map(([labels, value]) => ({ labels, value: value as number }));

        setPercenCategory(formattedCategoryPercen);
<<<<<<< HEAD:src/pages/MainPages/ChartPage.tsx
        setStatusCategory(statusStats);
        setPieCategory(categoryStats);
        setPieStatus(statusStats);
=======
        setStatusCategory(formattedStatus)
>>>>>>> 5ffd7a0dd3a3a666c602cf3f4ae4e7d9a7fa51d8:src/pages/MainPages/_ChartPage.tsx
    }, [reportData]);
    return (
        <>
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
<<<<<<< HEAD:src/pages/MainPages/ChartPage.tsx

=======
>>>>>>> 5ffd7a0dd3a3a666c602cf3f4ae4e7d9a7fa51d8:src/pages/MainPages/_ChartPage.tsx
                        />
                    </div>
                    <Suspense fallback={<>Loading..</>}>
                        <LineChart reports={currentYearReports} />
                    </Suspense>
                </div>

                <div className="w-full flex flex-col lg:flex-row gap-4 space-y-3 md:space-y-0 justify-center md:justify-between">
                    {/* Pie Chart Kategori */}
                    <div className="px-6 py-4 text-center rounded-2xl border border-gray-300 bg-white flex flex-col items-center">
                        <h1 className='font-bold'>Kategory</h1>
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
            </div >
        </>
    );
};

export default GraphicChart;