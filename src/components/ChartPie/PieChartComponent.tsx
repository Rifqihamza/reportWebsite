import React, { type Dispatch, type SetStateAction } from 'react';
import ReactApexChart from 'react-apexcharts';
import { statusColorHex, string_to_reporttype, type ReportType } from "../../types/variables";
interface ApexInternalConfig {
  config: {
    labels: string[];
    series: number[];
  };
}

interface Report {
    labels: string;
    value: number;
}

interface PieChartProps {
    reports: Report[];
    setReportType?: Dispatch<SetStateAction<ReportType|null>>;
    reportType?: ReportType|null
}

const PieChart: React.FC<PieChartProps> = ({ reports, setReportType, reportType }) => {

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
            events: {
                dataPointSelection: function(event: MouseEvent, chartContext: ApexCharts, config: {
                    seriesIndex: number;
                    dataPointIndex: number;
                    selectedDataPoints: number[][];
                    w: ApexInternalConfig;
                }) {
                    if(setReportType) {
                        const selectedIndex = config.dataPointIndex;
                        const selectedLabel = string_to_reporttype(config.w.config.labels[selectedIndex]);

                        setReportType((selectedLabel && selectedLabel != reportType) ? selectedLabel : null);
                    }
                }
            },
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

    return (
        <ReactApexChart options={options} series={series} type="pie" width="300" />
    );
};

export default PieChart;
