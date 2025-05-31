import React from 'react';
import {
    ReportStatus,
    ReportType,
    reporttype_to_string,
    type ReportData
} from '../../types/variables';
import {
    useFormatDate,
    statusColors,
    usePagination,
    useReportFilters
} from '../../hooks/useReportHooks';
import ReportPagination from './ReportPagination';

export const reportsPerPage = 7;

interface ReportDesktopTableProps {
    reportData: ReportData[];
    onDetailClick: (id: string) => void;
    selectedFilter: ReportType | ReportStatus | null;
    dateFilter: (Date | null)[];
    searchKeyword: string;
}

const ReportDesktopTable: React.FC<ReportDesktopTableProps> = ({
    reportData,
    onDetailClick,
    selectedFilter,
    dateFilter,
    searchKeyword
}) => {
    const { formatDate } = useFormatDate();
    const filteredReports = useReportFilters(reportData, selectedFilter, dateFilter, searchKeyword);

    const {
        currentPage,
        setCurrentPage,
        maxPage,
        currentItems: reports
    } = usePagination(filteredReports, reportsPerPage);

    return (
        <div className="hidden md:block overflow-auto bg-white rounded-2xl px-8 py-6">
            <table className="w-full h-[65vh]">
                <thead>
                    <tr>
                        {[
                            'Tanggal', 'Nama Pelapor', 'Laporan', 'Lokasi',
                            'PIC', 'Kategori', 'Status', 'Action'
                        ].map((header, i) => (
                            <th
                                key={header}
                                className={`px-2 py-3 text-center text-sm font-semibold text-black uppercase tracking-wider truncate border-y border-gray-200
                  ${i === 0 ? 'rounded-tl-xl' : ''} ${i === 7 ? 'rounded-tr-xl' : ''}`}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="border-b border-gray-300">
                    {reports.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="p-2 text-center opacity-75">Tidak ada laporan...</td>
                        </tr>
                    ) : (
                        reports.map((report) => (
                            <tr key={report.id} className="report-row" data-report-id={report.id}>
                                <td className="px-2 py-3 text-center text-sm text-gray-600 border-y border-gray-200">
                                    {formatDate(report.created_at)}
                                </td>
                                <td className="px-2 py-3 text-center text-sm text-gray-600 truncate max-w-[13rem] border-y border-gray-200">
                                    {report.submitted_by}
                                </td>
                                <td className="px-2 py-3 text-center text-sm text-gray-600 truncate max-w-[13rem] border-y border-gray-200">
                                    {report.message}
                                </td>
                                <td className="px-2 py-3 text-center text-sm text-gray-600 truncate max-w-[13rem] border-y border-gray-200">
                                    {report.location}
                                </td>
                                <td className="px-2 py-3 text-center text-sm text-gray-600 truncate max-w-[13rem] border-y border-gray-200">
                                    {report.pic_name || "Belum ditentukan"}
                                </td>
                                <td className="px-2 py-3 text-center text-sm text-gray-600 border-y border-gray-200">
                                    {reporttype_to_string(report.type)}
                                </td>
                                <td className="px-2 py-3 text-center border-y border-gray-200">
                                    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${statusColors[report.status as ReportStatus]}`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center text-sm font-medium border-y border-gray-200">
                                    <button
                                        className="bg-[#7FA1C3] hover:bg-[#6FA9E3] text-white px-3 py-1 rounded-xl duration-300"
                                        onClick={() => onDetailClick(report.id)}
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={8}>
                            <ReportPagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                maxPage={maxPage}
                                onPageChange={setCurrentPage}
                            />
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ReportDesktopTable;
