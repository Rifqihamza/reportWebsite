import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface Report {
    type: string;
    labels: string;
    value: number;
}

interface LineChartProps {
    reports: Report[];
}

const LineChart: React.FC<LineChartProps> = ({ reports }) => {

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
            palette: 'palette8'
        },
        dataLabels: {
            enabled: true,
        },
        xaxis: {
            categories,
        },
        yaxis: {
            max: reports.length > 0 ? (5 * Math.ceil((reports.sort((a, b) => b.value - a.value)[0].value / 5) + 0.2)) : 0
        },
        markers: {
            size: 3,
        },
        legend: {
            position: 'bottom' as const,
        },
        stroke: {
            curve: 'smooth' as const,
        }
    };

    return (
        <ReactApexChart options={options} series={series} type="line" height={300} />
    );
};

export default LineChart;