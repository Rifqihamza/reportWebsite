import BarChartIcon from '@mui/icons-material/BarChart';
import React, { useEffect, useState } from "react";
import type { ReportData } from "../../types/variables";
import { ReportType, reporttype_to_string } from '../../types/variables';
import { Suspense } from "react";
import { Calendar } from "primereact/calendar";
import strftime from "strftime";
import Dropdown from "../../components/Dropdown/DropdownComponent";



const LineChart = React.lazy(() => import("../../components/ChartLine/LineChartComponent"));
const PieChart = React.lazy(() => import("../../components/ChartPie/PieChartComponent"));


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

    useEffect(() => {
        // Generate line chart data
        let result: LineChartValueType[] = [];
        const currentDate = new Date();

        if(chartFilter == LineChartFilterOption.Year) {
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
        else if(chartFilter == LineChartFilterOption.Month) {
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
        else if(chartFilter == LineChartFilterOption.Week) {
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
        else if(chartFilter == LineChartFilterOption.Today) {
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
        
        reportData.filter(value => {
            const reportDate = new Date(value.created_at);
            let result_format = "";

            if(chartFilter == LineChartFilterOption.Today) {
                result_format += "%d%m";
            }
            else if(chartFilter == LineChartFilterOption.Month) {
                result_format += "%m";
            }
            else if(chartFilter == LineChartFilterOption.Week) {
                result_format = "%W";
            }

            result_format += "%y";

            return strftime(result_format, reportDate) == strftime(result_format, currentDate);
        }).forEach(data => {
            let date = new Date(data.created_at);
            let label = "";
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
                label = strftime("%k", date);
            }

            let index = result.findIndex(value => value.labels == label && value.type == reporttype_to_string(data.type));
            if(index != -1) {
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
        });

        setPieCategory(categoryStats);
        setPieStatus(statusStats);
    }, [reportData]);

    return (
        <>
            <div className="flex flex-row gap-2 justify-center items-center mb-4 md:justify-normal">
                <BarChartIcon fontSize="medium" />
                <h1 className="titlePage">Grafik Laporan</h1>
            </div>
            {/* Container Chart */}
            <div className="flex flex-col items-center md:items-start md:justify-between justify-center w-full gap-16 md:px-8 md:py-10">
                {/* Inner Container */}
                <div className="flex flex-col md:gap-15 gap-5 w-full justify-around items-center px-4 py-2">
                    {/* Pie Chart */}
                    <div className="w-full flex md:flex-col lg:flex-row xl:flex-row flex-col gap-10 justify-around items-center px-4 py-6 rounded-xl border border-gray-100">
                        <div className="flex flex-col justify-center items-center">
                            <h1 className='font-bold'>Persentase Kategori Temuan</h1>
                            <Suspense fallback={<>Loading..</>}>
                                <PieChart reports={pieCategory} />
                            </Suspense>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <h1 className='font-bold'>Persentase Status Temuan</h1>
                            <Suspense fallback={<>Loading..</>}>
                                <PieChart reports={pieStatus} />
                            </Suspense>
                        </div>
                    </div>
                    {/* End Pie Chart */}

                    {/* Line Chart */}
                    <div className="w-full px-4 py-2 rounded-xl border border-gray-100">
                        <div className="w-full flex flex-col lg:flex-row items-center justify-between px-2 py-1">
                            <h1 className='font-bold text-center text-xl'>Grafik Laporan Temuan</h1>
                            <div className='flex lg:flex-row lg:flex-wrap flex-col items-center gap-4 z-4'>
                                <Dropdown
                                    id="chartFilter"
                                    items={Object.values(LineChartFilterOption)}
                                    selected={chartFilter}
                                    setSelected={setChartFilter}
                                />
                            </div>
                        </div>
                        <LineChart reports={currentYearReports} />
                    </div>
                    {/* End Line Chart */}
                </div>
            </div >
        </>
    );
};

export default GraphicChart;
