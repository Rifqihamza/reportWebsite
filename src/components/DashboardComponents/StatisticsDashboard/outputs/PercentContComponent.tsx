import { useMemo } from 'react';
import { statusColorHex } from '../../../../types/variables';

interface Report {
    labels: string;
    value: number;
}

interface PercenContProps {
    reports: Report[];
    label: string;
}

export default function PercenConstComponent({ reports, label }: PercenContProps) {
    // Normalisasi dan kelompokkan data
    const groupedReports = useMemo(() => {
        const result: Record<string, number> = {};
        for (const report of reports) {
            const normalizedLabel = report.labels === "VR" ? "5R" : report.labels;
            result[normalizedLabel] = (result[normalizedLabel] || 0) + report.value;
        }
        return result;
    }, [reports]);

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
        <div className="px-6 py-4 rounded-xl space-y-4 w-full h-full bg-[#CB6040] shadow-md shadow-white text-white">
            <h1 className="text-md md:text-lg font-bold">Persentase {label}</h1>
            <div className="space-y-3 px-3 py-1">
                {percentageData.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm items-center">
                        <span
                            className="px-2 py-0.5 rounded-xl text-sm text-white"
                            style={{ backgroundColor: statusColorHex[item.name] || '#aaa' }}
                        >
                            {item.name}
                        </span>
                        <span className="font-semibold">{item.percent}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
