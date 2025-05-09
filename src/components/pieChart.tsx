import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface Report {
    labels: string;
    value: number;
}

interface PieChartProps {
    reports: Report[];
}

const PieChart: React.FC<PieChartProps> = ({ reports }) => {
    // Hitung jumlah masing-masing jenis laporan
    const reportByCategory = reports.reduce((acc, report) => {
        if (!acc[report.labels]) {
            acc[report.labels] = 0;
        }
        acc[report.labels] += report.value; // Tambahkan nilai ke kategori yang sesuai
        return acc;
    }, {} as Record<string, number>);


    const labels = Object.keys(reportByCategory);
    const series = Object.values(reportByCategory);

    const options = {
        chart: {
            type: 'pie' as const,
            data: series,
        },
        labels,
        theme: {
            palette: 'palette1' // upto palette10
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    offset: -25,
                },
            },
        },
        grid: {
            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            },
        },
        dataLabels: {
            enabled: true,
            offsetY: -30,
            style: {
                fontSize: '10px',
                colors: ["#fff"]
            }
        },
        legend: {
            show: true,
            position: 'bottom' as 'bottom',
            flexWrap: 'wrap' as 'wrap',
        },
    };

    return (
        <>
            <div id="chart" className='hidden md:flex flex-col items-center justify-center'>
                <ReactApexChart options={options} series={series} type="pie" width="350" />
            </div>
            <div id="chart" className='flex md:hidden flex-col flex-wrap items-center justify-center'>
                <ReactApexChart options={options} series={series} type="pie" width="300" />
            </div>
        </>
    );
};

export default PieChart;
