import LineChart from "../../components/lineChart";
import PieChart from "../../components/pieChart"
import { useEffect, useState } from "react";
import { Dropdown, } from 'primereact/dropdown';
import type { DropdownChangeEvent } from 'primereact/dropdown';
import type { ReportData } from "../../types/variables";
import { ReportType } from '../../types/variables';


// const pieCategory = [
//     { labels: "5R", value: 8 },
//     { labels: "Safety", value: 2 },
//     { labels: "K3", value: 5 },
//     { labels: "Abnormality", value: 5 },
// ];

// const pieStatus = [
//     { labels: "In Process", value: 2 },
//     { labels: "Complete", value: 5 },
//     { labels: "Hold", value: 5 },
//     { labels: "Not Started", value: 5 },
// ];

const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];

type CategoryType = {
    labels: string,
    value: number
}

type LineChartValueType = {
    labels: string;
    type: ReportType | string;
    value: number;
}

const GraphicChart = ({ reportData }: { reportData: ReportData[] }) => {
    const [availableYears, setAvailableYears] = useState([] as string[]);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [pieCategory, setPieCategory] = useState([] as CategoryType[])
    const [pieStatus, setPieStatus] = useState([] as CategoryType[])

    const [currentYearReports, setCurrentYearReports] = useState([] as LineChartValueType[]);



    useEffect(() => {
        let result: LineChartValueType[] = [];
        monthsShort.forEach(value => {
            Object.values(ReportType).map(reportType => {
                result.push({
                    labels: value,
                    type: reportType == ReportType.VR ? "5R" : reportType,
                    value: 0
                });
            });
        });
        reportData.filter(value => (new Date(value.created_at).getFullYear() == selectedYear)).forEach(data => {
            let date = new Date(data.created_at);
            let label = monthsShort[date.getMonth()];
            
            let index = result.findIndex(value => value.labels == label && value.type == (data.type == ReportType.VR ? "5R" : data.type));
            result[index].value += 1;
        })

        result.sort((a, b) => monthsShort.indexOf(a.labels) - monthsShort.indexOf(b.labels));

        setCurrentYearReports(result);
    }, [selectedYear, reportData]);
    
    useEffect(() => {
        // Get the category and status statistics
        let categoryStats: CategoryType[] = [];
        let statusStats: CategoryType[] = [];
        let resultAvailableYears: {
            [key: number]: number
        } = {};

        reportData.forEach(data => {
            let index = categoryStats.findIndex(res_data => res_data.labels == data.type.toString());
            if(index < 0) {
                categoryStats.push({
                    labels: data.type.toString(),
                    value: 1
                });
            }
            else {
                categoryStats[index].value += 1;
            }

            index = statusStats.findIndex(res_data => res_data.labels == data.status.toString());
            if(index < 0) {
                statusStats.push({
                    labels: data.status.toString(),
                    value: 1
                });
            }
            else {
                statusStats[index].value += 1;
            }

            let year = new Date(data.created_at).getFullYear();
            resultAvailableYears[year] = 0;
        });
        
        setPieCategory(categoryStats);
        setPieStatus(statusStats);
        let resultAvailableYearsKeys = Object.keys(resultAvailableYears);
        setAvailableYears(resultAvailableYearsKeys);
        setSelectedYear(Number.parseInt(resultAvailableYearsKeys[0]));
    }, [reportData]);
    
    
    return (
        <>
            <div className="flex flex-row gap-2 justify-center items-center mb-4 md:justify-normal">
                <img src="/icon/chartPieIcon.svg" className="md:w-5 w-7 h-auto" alt="" />
                <h1 className="font-bold uppercase tracking-[2px] text-md md:text-lg text-black">Data Grafik Laporan</h1>
            </div>

            {/* Container Chart */}
            <div className="flex flex-col items-center md:items-start md:justify-between justify-center w-full gap-16 md:px-8 md:py-10">
                {/* Inner Container */}
                <div className="flex flex-col md:gap-15 gap-5 w-full justify-around items-center px-4 py-2">
                    {/* Pie Chart */}
                    <div className="w-full flex md:flex-col lg:flex-row xl:flex-row flex-col gap-10 justify-around items-center px-4 py-6 rounded-xl shadow-inner shadow-gray-300">
                        <div className="flex flex-col justify-center items-center">
                            <h1 className='font-bold'>Grafik Pie Kategori</h1>
                            <PieChart reports={pieCategory} />
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <h1 className='font-bold'>Grafik Pie Status</h1>
                            <PieChart reports={pieStatus} />
                        </div>
                    </div>
                    {/* End Pie Chart */}

                    {/* Line Chart */}
                    <div className="w-full mt-6 px-4 py-2 rounded-xl shadow-inner shadow-gray-300 ">
                        <div className="w-full my-2">
                            <Dropdown
                                value={availableYears[0]}
                                onChange={(e: DropdownChangeEvent) => setSelectedYear(e.value)}
                                options={availableYears}
                                optionLabel="label"
                                placeholder="Pilih Tahun"
                                className="w-full "
                            />
                        </div>
                        <LineChart reports={currentYearReports} />
                    </div>
                    {/* End Line Chart */}
                </div>
                {/* End Inner Container */}
            </div>
            {/* End Container Chart */}
        </>
    )
}

export default GraphicChart;
