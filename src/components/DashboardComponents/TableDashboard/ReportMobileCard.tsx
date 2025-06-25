    import React from 'react';
    import { reporttype_to_string, type ReportData } from '../../../types/variables';
    import { statusColors, useReportDetailHook } from "../../../hooks/useReportHook";
    import { formatDate } from "../../../utils/other";

    interface ReportMobileCardProps {
        report: ReportData;
    }

    const ReportMobileCard: React.FC<ReportMobileCardProps> = ({ report }) => {
        const { handleDetail } = useReportDetailHook();

        return (
            <div
                className="report-card relative bg-white p-4 shadow-sm border border-gray-200"
                data-report-id={report.id}
            >
                <div className='z-50'>
                    <span className='bg-[#7FA1C3] absolute top-0 left-0 right-0 h-1/4'></span>
                    <div className="flex flex-col mb-2 text-center ">
                        <h3 className="text-lg lg:text-2xl text-gray-900 truncate">Laporan terkait <span className="font-semibold">{reporttype_to_string(report.type)}</span></h3>
                        <p className="text-xs lg:text-md truncate">{formatDate(new Date(report.created_at).toISOString())}</p>
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
                        <p>
                            Status Laporan: <span className={`px-6 py-1 text-xs font-semibold rounded-full truncate ${statusColors[report.status]}`}> {report.status}</span>
                        </p>
                    </div>
                    <div className="mt-3 flex justify-end">
                        <button
                            className="mobile-detail-button text-white bg-[#7FA1C3] px-3 py-2 rounded-xl text-sm font-medium"
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