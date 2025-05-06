import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface Report {
    label: string;
    value: number;
    type: string;
}

interface PieChartProps {
    reports: Report[];
}

const PieChart: React.FC<PieChartProps> = ({ reports }) => {
    const labels = reports.map(value => value.label);
    const series = reports.map(value => value.value);

    const options = {
        chart: {
            type: 'pie' as const,
            data: 'data'
        },
        labels,
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
            formatter(val: number, opts: { w: { globals: { labels: string[] } }, seriesIndex: number }) {
                const name = opts.w.globals.labels[opts.seriesIndex];
                return [name, val.toFixed(1) + '%'];
            },
        },
        legend: {
            show: false,
        },
    };

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="pie" width="300" />
        </div>
    );
};

export default PieChart;
