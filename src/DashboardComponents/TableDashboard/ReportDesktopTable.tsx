import { reporttype_to_string } from '../../types/variables';
import { useReportDetailHook, useReportPaginationHook, statusColors } from "../../hooks/useReportHook";
import { formatDate } from "../../utils/other";

export default function ReportDesktopTable() {
    const { showedReportData } = useReportPaginationHook();
    const { handleDetail } = useReportDetailHook();

    return (
        <div className="hidden md:block overflow-auto relative bg-white rounded-xl px-6 py-4">
            <table className="w-full h-[70vh] max-h-[65vh]">
                <thead>
                    <tr>
                        <th
                            scope="col"
                            className="rounded-tl-xl px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate"
                        >
                            Tanggal
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate"
                        >
                            Nama Pelapor
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate"
                        >
                            Laporan
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate"
                        >
                            Lokasi
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate"
                        >
                            PIC
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate"
                        >
                            Kategori
                        </th>
                        <th
                            scope="col"
                            className="px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate"
                        >
                            Status
                        </th>
                        <th
                            scope="col"
                            className="rounded-tr-xl px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate"
                        >
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {showedReportData.length === 0 ? (
                        <tr>
                            <td className="w-fit" colSpan={8}>
                                <h1 className="p-2 opacity-75 text-center">Tidak ada laporan...</h1>
                            </td>
                        </tr>
                    ) : (
                        showedReportData.map((report, index) => (
                            <tr key={index} className="report-row" data-report-id={report.id}>
                                <td className="px-2 py-3 text-center border-b border-gray-300 whitespace-nowrap text-sm text-gray-600">
                                    {formatDate(report.created_at)}
                                </td>
                                <td className="px-2 py-3 text-center border-b border-gray-300 text-sm text-gray-600 max-w-[13rem] truncate">
                                    {report.submitted_by}
                                </td>
                                <td className="px-2 py-3 text-center border-b border-gray-300 text-sm text-gray-600 max-w-[13rem] truncate">
                                    {report.message}
                                </td>
                                <td className="px-2 py-3 text-center border-b border-gray-300 whitespace-nowrap text-sm text-gray-600 max-w-[13rem] truncate">
                                    {report.location}
                                </td>
                                <td className="px-2 py-3 text-center border-b border-gray-300 whitespace-nowrap text-sm text-gray-600 max-w-[13rem] truncate">
                                    {report.pic_name || "Belum ditentukan"}
                                </td>
                                <td className="px-2 py-3 text-center border-b border-gray-300 whitespace-nowrap text-sm text-gray-600 w-[13rem]">
                                    {reporttype_to_string(report.type)}
                                </td>
                                <td className="px-2 py-3 text-center border-b border-gray-300 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[report.status]}`}
                                    >
                                        {report.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white text-center border-b border-gray-300">
                                    <button
                                        className="bg-[#7FA1C3] hover:bg-[#6FA9E3] px-3 py-1 rounded-xl duration-300"
                                        onClick={() => handleDetail(report.id)}
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
