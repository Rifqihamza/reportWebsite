import React, { useMemo } from 'react';

interface Report {
    labels: string;
    value: number;
}

interface PercenContProps {
    reports: Report[];
    icon: string;
    label: string;
}

const statusColors: {
    [key: string]: string
} = {
    NotStarted: "bg-red-100 text-red-800",
    InProcess: "bg-yellow-100 text-yellow-800",
    Complete: "bg-green-100 text-green-800",
    Hold: "bg-blue-100 text-blue-800",
    Abnormality: "text-white bg-yellow-500",
    "5R": "text-white bg-indigo-400",
    Safety: "text-white bg-orange-400"
};

const PercenContComponent: React.FC<PercenContProps> = ({ reports, icon, label }) => {

    // Normalize label "VR" ke "5R" dan kelompokkan
    const groupedReports = useMemo(() => {
        const result: Record<string, number> = {};
        for (const report of reports) {
            const normalizedLabel = report.labels === "VR" ? "5R" : report.labels;
            result[normalizedLabel] = (result[normalizedLabel] || 0) + report.value;
        }
        return result;
    }, [reports]);

    // Hitung total dan persentase
    const total = useMemo(() =>
        Object.values(groupedReports).reduce((sum, val) => sum + val, 0),
        [groupedReports]
    );

    const percentageData = useMemo(() =>
        Object.entries(groupedReports).map(([name, value]) => ({
            name,
            value,
            percent: ((value / total) * 100).toFixed(1) + '%'
        })),
        [groupedReports, total]
    );

    return (
        <div className='bg-black/10 backdrop-blur-md px-6 py-4 rounded-xl  space-y-4'>
            <div className='flex flex-row justify-between items-center gap-10'>
                <h1 className="md:text-[16px] text-xl text-white font-bold whitespace-nowrap">Persentase {label}</h1>
                <span><i className={icon} style={{ fontSize: 20, color: "#fff" }} /></span>
            </div>
            <div className='space-y-3 px-3 py-1'>
                {percentageData.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                        <span className={`${statusColors[item.name]} px-2 py-0.5 rounded-xl text-sm`}>{item.name}</span>
                        <span className='font-semibold'>{item.percent}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PercenContComponent;
