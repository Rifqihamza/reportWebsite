import React from 'react';
import { reporttype_to_string, type ReportData } from '../../../types/variables';
import { useFormatDate, statusColors } from '../../../hooks/useReportHooks';

interface ReportMobileCardProps {
    report: ReportData;
    onDetail: (id: string) => void;
}

const ReportMobileCard: React.FC<ReportMobileCardProps> = ({ report, onDetail }) => {
    const { formatDate } = useFormatDate();

    return (
        <div
            className="report-card bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            data-report-id={report.id}
        >
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg lg:text-2xl text-gray-900 truncate">Details Laporan</h3>
                <p className="font-semibold text-xs lg:text-md truncate">{formatDate(new Date(report.created_at).toISOString())}</p>
            </div>
            <div className="text-sm text-gray-500 space-y-2 break-all">
                <p>
                    <span className="font-semibold">Nama Pelapor: </span> {report.submitted_by}
                </p>
                <p>
                    <span className="font-semibold">Laporan: </span>{report.message}
                </p>
                <p>
                    <span className="font-semibold">Lokasi:</span> {report.location}
                </p>
                <p>
                    <span className="font-semibold">PIC:</span> {report.pic_name || "Belum ditentukan"}
                </p>
                <p>
                    <span className="font-semibold">Kategori:</span> {reporttype_to_string(report.type)}
                </p>
                <p>
                    <span className="font-semibold">Tanggal Temuan:</span> {formatDate(new Date(report.report_date).toISOString())}
                </p>
                <p>
                    <span className="font-semibold">Due Date:</span> {report.due_date ? formatDate(new Date(report.due_date).toISOString()) : "Belum ditentukan"}
                </p>
                <p>
                    Status Laporan: <span className={`px-6 py-1 text-xs font-semibold rounded-full truncate ${statusColors[report.status]}`}> {report.status}</span>
                </p>
            </div>
            <div className="mt-3 flex justify-end">
                <button
                    className="mobile-detail-button text-white bg-[#7FA1C3] px-3 py-2 rounded-xl text-sm font-medium"
                    onClick={() => onDetail(report.id)}
                >
                    Lihat Detail
                </button>
            </div>
        </div>
    );
};

export default ReportMobileCard;