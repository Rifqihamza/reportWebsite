import LineChart from "../../components/lineChart";
import PieChart from "../../components/pieChart"
import BarChartIcon from '@mui/icons-material/BarChart';
import { useState } from "react";
import { Dropdown, } from 'primereact/dropdown';
import type { DropdownChangeEvent } from 'primereact/dropdown';
import { lineReports } from "../../types/lineChartData";


const pieCategory = [
    { labels: "5R", value: 8 },
    { labels: "Safety", value: 2 },
    { labels: "K3", value: 5 },
    { labels: "Abnormality", value: 5 },
];

const pieStatus = [
    { labels: "In Process", value: 2 },
    { labels: "Complete", value: 8 },
    { labels: "Hold", value: 5 },
    { labels: "Not Started", value: 5 },
];

const GraphicChart = () => {
    const availableYears = Array.from(new Set(lineReports.map(report => report.year)));
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    const currentYearReports = lineReports
        .filter(report => report.year === selectedYear)
        .flatMap(({ labels, data }) =>
            Object.entries(data).map(([type, value]) => ({ labels, type, value }))
        );

    const yearOptions = availableYears.map(year => ({ label: year.toString(), value: year }));

    return (
        <>
            <div className="flex flex-row gap-2 justify-center items-center mb-4 md:justify-normal">
                <BarChartIcon fontSize="medium" />
                {/* Header Title */}
                <h1 className="font-bold uppercase tracking-[2px] text-md md:text-lg text-black">Data Grafik Laporan</h1>
            </div>

            {/* Container Chart */}
            <div className="flex flex-col items-center md:items-start md:justify-between justify-center w-full gap-16 md:px-8 md:py-10">
                {/* Inner Container */}
                <div className="flex flex-col md:gap-15 gap-5 w-full justify-around items-center px-4 py-2">
                    {/* Pie Chart */}
                    <div className="w-full flex md:flex-col lg:flex-row xl:flex-row flex-col gap-10 justify-around items-center px-4 py-6 rounded-xl border border-gray-100">
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
                    <div className="w-full mt-6 px-4 py-2 rounded-xl border border-gray-100">
                        <div className="w-full my-2">
                            <Dropdown
                                value={selectedYear}
                                onChange={(e: DropdownChangeEvent) => setSelectedYear(e.value)}
                                options={yearOptions}
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
