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

    const categories = Array.from(new Set(reports.map(r => r.labels))); // Ambil semua bulan unik
    const types = Array.from(new Set(reports.map(r => r.type))); // Ambil semua jenis laporan unik

    // Inisialisasi objek { type: { bulan: nilai } }
    const grouped: Record<string, Record<string, number>> = {};
    types.forEach(type => {
        grouped[type] = {};
        categories.forEach(label => {
            grouped[type][label] = 0; // Default 0 jika tidak ada data
        });
    });

    // Isi data
    reports.forEach(report => {
        grouped[report.type][report.labels] += report.value;
    });

    // Buat series sesuai format ApexCharts
    const series = types.map(type => ({
        name: type,
        data: categories.map(label => grouped[type][label]),
    }));

    const options = {
        chart: {
            type: 'line' as const,
        },
        theme: {
            palette: 'palette7' // upto palette10
        },
        dataLabels: {
            enabled: true,
        },
        xaxis: {
            categories,
        },
        title: {
            text: 'Grafik Laporan Bulanan',
            style: {
                fontSize: '14px',
                color: '#000',
            },
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
        <>
            <div className='hidden md:block'>
                <ReactApexChart options={options} series={series} type="line" height={350} />
            </div>
            <div className='block md:hidden'>
                <ReactApexChart options={options} series={series} type="line" height={400} />
            </div>
        </>
    );
};

export default LineChart;