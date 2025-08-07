import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { statusColorHex, string_to_reporttype, type ReportType } from "../../../../../types/variables";
import { usePieChartHook } from "../../../../../hooks/pages/Statistics/useChartHook";
interface ApexInternalConfig {
  config: {
    labels: string[];
    series: number[];
  };
}

interface PieChartProps {
    pieData: Record<string, number>
}

const PieChart: React.FC<PieChartProps> = ({ pieData }) => {
    // Hitung jumlah masing-masing jenis laporan
    const labels = Object.keys(pieData);
    const series = Object.values(pieData);
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
                    offset: -20,
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
            offsetY: -20,
            style: {
                fontSize: '10px',
                colors: ["#fff"]
            }
        },
        legend: {
            show: true,
            position: 'bottom' as 'bottom'
        },
    };

    if(!series.some((value) => value > 0)) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <p className="text-white text-center opacity-50">Tidak ada yang dapat ditampilkan</p>
            </div>
        );
    }

    return (
        <ReactApexChart options={options} series={series} type="pie" width="300" />
    );
};

export default PieChart;
