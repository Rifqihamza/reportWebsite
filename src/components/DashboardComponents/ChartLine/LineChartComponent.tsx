import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface Report {
    type: string;
    labels: string;
    value: number;
}

interface LineChartProps {
    reports: Report[];
    colors: string[]
}

const LineChart: React.FC<LineChartProps> = ({ reports, colors }) => {

    const categories = Array.from(new Set(reports.map(r => r.labels)));
    const types = Array.from(new Set(reports.map(r => r.type)));

    const grouped: Record<string, Record<string, number>> = {};
    types.forEach(type => {
        grouped[type] = {};
        categories.forEach(label => {
            grouped[type][label] = 0;
        });
    });

    reports.forEach(report => {
        grouped[report.type][report.labels] += report.value;
    });

    const series = types.map(type => ({
        name: type,
        data: categories.map(label => grouped[type][label]),
    }));

    const options = {
        chart: {
            type: 'line' as const,
        },
        theme: {
            palette: 'palette1'
        },
        colors: colors,
        dataLabels: {
            enabled: true,
        },
        xaxis: {
            categories,
        },
        yaxis: {
            max: reports.length > 0 ? ((reports.length > 50 ? 5 : 2) * Math.ceil((reports.sort((a, b) => b.value - a.value)[0].value / (reports.length > 50 ? 5 : 2)) + 0.1)) : 0
        },
        markers: {
            size: 4,
        },
        legend: {
            position: 'bottom' as const,
        },
        stroke: {
            curve: 'smooth' as const,
        }
    };

    return (
        <ReactApexChart options={options} series={series} type="line" height={400} />
    );
};

export default LineChart;