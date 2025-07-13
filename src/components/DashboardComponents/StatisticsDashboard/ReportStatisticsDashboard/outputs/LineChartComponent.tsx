import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { LineChartTimeCategoryOption, listOfDay, listOfMonths, useLineChartHook } from '../../../../../hooks/pages/Statistics/useChartHook';

const maxYAxisSnapLength = 10;

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
    const { appliedChartTimeFilter } = useLineChartHook();
    reports.sort((a, b) => {
        if(appliedChartTimeFilter === LineChartTimeCategoryOption.Year) {
            return listOfMonths.indexOf(a.labels) - listOfMonths.indexOf(b.labels);
        }
        else if(appliedChartTimeFilter === LineChartTimeCategoryOption.Month) {
            return Number.parseInt(a.labels) - Number.parseInt(b.labels);
        }
        else if(appliedChartTimeFilter === LineChartTimeCategoryOption.Week) {
            return listOfDay.indexOf(a.labels) - listOfDay.indexOf(b.labels);
        }
        else {
            return Number.parseInt(a.labels) - Number.parseInt(b.labels);
        }
    })
    const categories = Array.from(new Set([...reports].map(r => {
        return r.labels
    })));
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
            max: reports.length > 0 ? (maxYAxisSnapLength * Math.ceil((reports.sort((a, b) => b.value - a.value)[0].value / maxYAxisSnapLength) + 0.1)) : 0
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
        <ReactApexChart options={options} series={series} type="line" height={300} />
    );
};

export default LineChart;