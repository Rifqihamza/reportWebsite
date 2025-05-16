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
    const statusColorHex: Record<string, string> = {
        NotStarted: "#fca5a5", // Tailwind bg-red-300
        InProcess: "#fde047",  // Tailwind bg-yellow-300
        Complete: "#86efac",   // Tailwind bg-green-300
        Hold: "#93c5fd",       // Tailwind bg-blue-300
        Abnormality: "#f3d262",
        "5R": "#7750a5",
        Safety: "#ea8557"
    };

    // Hitung jumlah masing-masing jenis laporan
    const reportByCategory = reports.reduce((acc, report) => {
        report.labels = (report.labels == "VR" ? "5R" : report.labels);
        if (!acc[report.labels]) {
            acc[report.labels] = 0;
        }
        acc[report.labels] += report.value; // Tambahkan nilai ke kategori yang sesuai
        return acc;
    }, {} as Record<string, number>);


    const labels = Object.keys(reportByCategory);
    const series = Object.values(reportByCategory);
    const colors = labels.map(label => statusColorHex[label] || '#E0E0E0'); // default gray if not matched

    const options = {
        chart: {
            type: 'pie' as const,
            data: series,
        },
        labels,
        colors,
        theme: {
            monochrome: {
                enabled: false
            }
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
            show: false,
            position: 'bottom' as 'bottom',
            flexWrap: 'wrap' as 'wrap',
        },
    };

    return (
        <ReactApexChart options={options} series={series} type="pie" width="200" />
    );
};

export default PieChart;
