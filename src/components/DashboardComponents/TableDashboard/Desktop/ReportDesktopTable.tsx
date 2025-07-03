import { reporttype_to_string, table_rows } from '../../../../types/variables';
import { useReportDetailHook, useReportPaginationHook, statusColors } from "../../../../hooks/useReportHook";
import { formatDate } from "../../../../utils/other";
import { useReportDataHook } from "../../../../hooks/shared/useReportData";
import LoadingAnimation from "../../../GlobalComponents/Loading/LoadingAnimation";

export default function ReportDesktopTable() {
    const { showedReportData } = useReportPaginationHook();
    const { handleDetail } = useReportDetailHook();
    const { reportData } = useReportDataHook();

    return <>

        <div className='hidden md:block overflow-auto relative bg-white rounded-xl px-6 py-4 h-[70vh]'>
            <table className="w-full">
                <thead>
                    <tr>
                        {Object.keys(table_rows).map((key) => {
                            return <th
                                key={key}
                                scope="col"
                                className="rounded-tl-xl px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate"
                            >
                                {key}
                            </th>;
                        })}
                        <th
                            scope="col"
                            className="rounded-tr-xl px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate"
                        >
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        // If the data is not loaded returns loading animation
                        if (reportData === null) {
                            return <tr><td><LoadingAnimation /></td></tr>
                        }

                        // If there's no data
                        if (showedReportData.length === 0) {
                            return <tr>
                                <td className="w-fit py-4" colSpan={9}>
                                    <h1 className="p-2 opacity-75 text-center">{reportData.length == 0 ? "Tidak ada laporan..." : "Tidak ada laporan yang sesuai dengan filter"}</h1>
                                </td>
                            </tr>
                        }

                        // Return a normal report data
                        return <>
                            {showedReportData.map((report, index) => (
                                <tr key={index} className="" data-report-id={report.id}>

                                    <td className="px-2 py-3 text-center border-b border-gray-300 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[report.status]}`}
                                        >
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-2 py-3 text-center border-b border-gray-300 text-sm text-gray-600 truncate">
                                        {report.submitted_by}
                                    </td>
                                    <td className="px-2 py-3 border-b border-gray-300 text-sm text-gray-600 truncate">
                                        {report.message}
                                    </td>
                                    <td className="px-2 py-3 text-center border-b border-gray-300 whitespace-nowrap">
                                        {report.campus}
                                    </td>
                                    <td className="px-2 py-3 text-center border-b border-gray-300 whitespace-nowrap text-sm text-gray-600">
                                        {formatDate(report.created_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white text-center border-b border-gray-300">
                                        <button
                                            className="bg-[#1f324d] hover:bg-[#6FA9E3] px-3 py-1 rounded-xl duration-300"
                                            onClick={() => handleDetail(report.id)}
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </>;
                    })()}
                </tbody>
            </table>
        </div>
    </>;
};
