import React from 'react';
import { reporttype_to_string, type ReportData } from '../../../types/variables';
import { statusColors, useReportDetailHook } from "../../../hooks/pages/ReportTable/useReportHook";
import { formatDate } from "../../../utils/other";

interface ReportMobileCardProps {
    report: ReportData;
}

const ReportMobileCard: React.FC<ReportMobileCardProps> = ({ report }) => {
    const { handleDetail } = useReportDetailHook();

    return (
        <div
            className="report-card relative bg-white p-4 shadow-sm rounded-2xl"
            data-report-id={report.id}
        >
            <div className='z-50'>
                <div className="flex flex-col items-center mb-2 text-center ">
                    <h3 className="text-lg lg:text-2xl text-gray-900 truncate z-1">Laporan terkait <span className="font-semibold">{reporttype_to_string(report.type)}</span></h3>
                    <p className="text-xs lg:text-md truncate">{formatDate(new Date(report.created_at).toISOString())}</p>
                    <span className={`w-fit mt-2 px-6 py-1 text-xs font-semibold rounded-full truncate ${statusColors[report.status]}`}> {report.status}</span>
                </div>
                <hr />
                <div className="text-sm text-gray-500 space-y-2 break-all mt-4 *:font-medium">
                    <p>
                        <span className="font-bold">Nama Pelapor: </span> {report.submitted_by}
                    </p>
                    <p>
                        <span className="font-bold">Laporan: </span>{report.message}
                    </p>
                    <p>
                        <span className="font-bold">Lokasi:</span> {report.location_name}
                    </p>
                </div>
                <div className="mt-3 flex justify-end">
                    <button
                        className="mobile-detail-button text-white bg-slate-900 px-3 py-2 rounded-xl text-sm font-medium"
                        onClick={() => handleDetail(report.id)}
                    >
                        Lihat Detail
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportMobileCard;