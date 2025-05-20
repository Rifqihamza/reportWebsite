import React, { useEffect, useState, Suspense } from "react";
import { Dropdown } from 'primereact/dropdown';
import type { DropdownChangeEvent } from 'primereact/dropdown';
import type { ReportData } from "../../types/variables";
import { ReportType, reporttype_to_string } from '../../types/variables';



const LineChart = React.lazy(() => import("../../components/ChartLine/LineChartComponent"));
const PieChart = React.lazy(() => import("../../components/ChartPie/PieChartComponent"));
const PercenComp = React.lazy(() => import("../../components/PercenContainer/PercenContComponent"));

const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];

type CategoryType = {
    labels: string;
    value: number;
};

type LineChartValueType = {
    labels: string;
    type: ReportType | string;
    value: number;
};

const GraphicChart = ({ reportData }: { reportData: ReportData[] }) => {
    const currentYear = new Date().getFullYear();
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [currentYearReports, setCurrentYearReports] = useState<LineChartValueType[]>([]);
    const [pieCategory, setPieCategory] = useState<CategoryType[]>([]);
    const [pieStatus, setPieStatus] = useState<CategoryType[]>([]);
    const [percenCategory, setPercenCategory] = useState<CategoryType[]>([]);
    const [statusCategory, setStatusCategory] = useState<CategoryType[]>([]);
    useEffect(() => {
        // Generate line chart data
        let result: LineChartValueType[] = [];
        monthsShort.forEach(month => {
            Object.values(ReportType).forEach(reportType => {
                result.push({
                    labels: month,
                    type: reporttype_to_string(reportType),
                    value: 0,
                });
            });
        });

        reportData
            .filter(report => new Date(report.created_at).getFullYear() === selectedYear)
            .forEach(report => {
                const date = new Date(report.created_at);
                const label = monthsShort[date.getMonth()];
                const typeLabel = reporttype_to_string(report.type);

                const index = result.findIndex(
                    r => r.labels === label && r.type === typeLabel
                );
                if (index !== -1) {
                    result[index].value += 1;
                }
            });

        result.sort((a, b) => monthsShort.indexOf(a.labels) - monthsShort.indexOf(b.labels));
        setCurrentYearReports(result);
    }, [selectedYear, reportData]);

    useEffect(() => {
        const categoryStats: Record<string, number> = {};
        const statusStats: Record<string, number> = {};
        const percenStats: Record<string, number> = {};
        const yearSet = new Set<number>();

        reportData.forEach(report => {
            const year = new Date(report.created_at).getFullYear();
            yearSet.add(year);

            const typeLabel = reporttype_to_string(report.type);
            categoryStats[typeLabel] = (categoryStats[typeLabel] || 0) + 1;

            const statusLabel = report.status.toString();
            statusStats[statusLabel] = (statusStats[statusLabel] || 0) + 1;

            const percenLabel = reporttype_to_string(report.type);
            percenStats[percenLabel] = (percenStats[percenLabel] || 0) + 1;
        });

        const formattedCategory = Object.entries(categoryStats).map(([labels, value]) => ({ labels, value: value as number }));
        const formattedCategoryPercen = Object.entries(percenStats).map(([labels, value]) => ({ labels, value: value as number }));
        const formattedStatus = Object.entries(statusStats).map(([labels, value]) => ({ labels, value: value as number }));

        setPieCategory(formattedCategory);
        setPieStatus(formattedStatus);
        setPercenCategory(formattedCategoryPercen);
        setStatusCategory(formattedStatus)
        setAvailableYears(Array.from(yearSet).sort((a, b) => b - a));
        setSelectedYear(current => (yearSet.has(current) ? current : Array.from(yearSet)[0]));
    }, [reportData]);

    return (
        <>
            <div className='flex flex-col gap-4'>
                {/* Line Chart */}
                <div className="w-full px-3 py-4 rounded-2xl border border-gray-300 bg-white">
                    <div className="w-full flex flex-col lg:flex-row items-center justify-between px-2 py-1">
                        <h1 className='font-bold text-center text-xl'>Grafik Laporan Temuan</h1>
                        <Dropdown
                            value={selectedYear}
                            onChange={(e: DropdownChangeEvent) => setSelectedYear(e.value)}
                            options={availableYears}
                            placeholder="Pilih Tahun"
                            className="w-full lg:w-fit"
                        />
                    </div>
                    <Suspense fallback={<>Loading..</>}>
                        <LineChart reports={currentYearReports} />
                    </Suspense>
                </div>

                <div className="w-full flex flex-col lg:flex-row gap-4 space-y-3 md:space-y-0 justify-center md:justify-between">
                    {/* Pie Chart Kategori */}
                    <div className="px-6 py-4 text-center rounded-2xl border border-gray-300 bg-white flex flex-col items-center">
                        <h1 className='font-bold'>Persentase Kategori Temuan</h1>
                        <Suspense fallback={<>Loading..</>}>
                            <PieChart reports={pieCategory} />
                        </Suspense>
                    </div>

                    {/* Pie Chart Status */}
                    <div className="px-6 py-4 text-center rounded-2xl border border-gray-300 bg-white flex flex-col items-center">
                        <h1 className='font-bold'>Persentase Status Temuan</h1>
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