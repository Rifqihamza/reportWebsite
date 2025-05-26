import React from 'react';
import { reporttype_to_string, type ReportData } from '../../types/variables';
import { useFormatDate, statusColors } from '../../hooks/useReportHooks';

interface ReportDesktopTableProps {
    reports: ReportData[];
    onDetailClick: (id: string) => void;
}

const ReportDesktopTable: React.FC<ReportDesktopTableProps> = ({ reports, onDetailClick }) => {
    const { formatDate } = useFormatDate();

    return (
        <div className="hidden md:block overflow-auto relative border border-gray-300 rounded-xl">
            <table className="w-full h-[70vh] max-h-[65vh]">
                <thead>
                    <tr>
                        <th
                            scope="col"
                            className="rounded-tl-xl px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
                        >
                            Tanggal
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
                        >
                            Nama Pelapor
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
                        >
                            Laporan
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
                        >
                            Lokasi
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
                        >
                            PIC
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
                        >
                            Kategori
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
                        >
                            Status
                        </th>
                        <th
                            scope="col"
                            className="rounded-tr-xl px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
                        >
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="border-b border-gray-300">
                    {reports.length === 0 ? (
                        <tr>
                            <td className="w-fit" colSpan={8}>
                                <h1 className="p-2 opacity-75 text-center">Tidak ada laporan...</h1>
                            </td>
                        </tr>
                    ) : (
                        reports.map((report, index) => (
                            <tr key={index} className="report-row" data-report-id={report.id}>
                                <td className="px-2 py-3 text-center whitespace-nowrap text-sm text-gray-600">
                                    {formatDate(report.created_at)}
                                </td>
                                <td className="px-2 py-3 text-center text-sm text-gray-600 max-w-[13rem] truncate">
                                    {report.submitted_by}
                                </td>
                                <td className="px-2 py-3 text-center text-sm text-gray-600 max-w-[13rem] truncate">
                                    {report.message}
                                </td>
                                <td className="px-2 py-3 text-center whitespace-nowrap text-sm text-gray-600 max-w-[13rem] truncate">
                                    {report.location}
                                </td>
                                <td className="px-2 py-3 text-center whitespace-nowrap text-sm text-gray-600 max-w-[13rem] truncate">
                                    {report.pic_name || "Belum ditentukan"}
                                </td>
                                <td className="px-2 py-3 text-center whitespace-nowrap text-sm text-gray-600 w-[13rem]">
                                    {reporttype_to_string(report.type)}
                                </td>
                                <td className="px-2 py-3 text-center whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[report.status]}`}
                                    >
                                        {report.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white text-center">
                                    <button
                                        className="bg-[#7FA1C3] hover:bg-[#6FA9E3] px-3 py-1 rounded-xl duration-300"
                                        onClick={() => onDetailClick(report.id)}
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReportDesktopTable;
