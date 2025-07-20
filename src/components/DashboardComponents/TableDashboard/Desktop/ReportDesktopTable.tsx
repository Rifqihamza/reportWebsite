import { table_rows } from '../../../../types/variables';
import { statusColorHex } from '../../../../types/variables';
import { useReportDetailHook, useReportPaginationHook } from "../../../../hooks/pages/ReportTable/useReportHook";
import { formatDate } from "../../../../utils/other";
import { useReportDataHook } from "../../../../hooks/shared/useReportData";
import LoadingAnimation from "../../../GlobalComponents/Loading/LoadingAnimation";
import UseUserDataHookEffect, { useUserDataHook } from "../../../../hooks/shared/useUserData";

export default function ReportDesktopTable() {
    const { showedReportData } = useReportPaginationHook();
    const { handleDetail } = useReportDetailHook();
    const { reportData, isAuthorized: isAuthorizedGetReport } = useReportDataHook();
    const { userData } = useUserDataHook();



    return <>
        <UseUserDataHookEffect />
        <div className='hidden md:block overflow-auto p-5 bg-[#CB6040] rounded-xl'>
            <table className="w-full relative min-h-48">
                <thead>
                    <tr>
                        {Object.keys(table_rows).map((key) => {
                            return <th
                                key={key}
                                scope="col"
                                className="rounded-tl-xl px-2 py-3 border-b border-[#F2E5BF] text-left text-sm font-semibold text-white uppercase tracking-wider truncate"
                            >
                                {key}
                            </th>;
                        })}
                        <th
                            scope="col"
                            className="rounded-tr-xl px-2 py-3 border-b border-[#F2E5BF] text-center text-sm font-semibold text-white uppercase tracking-wider truncate"
                        >
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        // If unaothorized
                        if (!isAuthorizedGetReport) {
                            return <tr><td colSpan={9}>{userData?.role} tidak diperbolehkan melihat data laporan.</td></tr>
                        }

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

                                    <td className="px-2 py-3 text-left border-b border-[#F2E5BF] whitespace-nowrap min-w-20! max-w-20!">
                                        <span
                                            style={{ backgroundColor: statusColorHex[report.status] }}
                                            className="px-2 w-full inline-flex justify-center text-xs text-white leading-6 font-semibold rounded-4xl"
                                        >
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-2 py-3 text-left border-b border-[#F2E5BF] text-sm text-white font-medium truncate min-w-24! max-w-24!">
                                        {report.submitted_by}
                                    </td>
                                    <td className="px-2 py-3 border-b border-[#F2E5BF] text-sm text-white font-medium truncate min-w-48! max-w-48!">
                                        {report.message}
                                    </td>
                                    <td className="px-2 py-3 text-left border-b border-[#F2E5BF] text-white font-medium truncate min-w-12! max-w-12!">
                                        {report.campus}
                                    </td>
                                    <td className="px-2 py-3 text-left border-b border-[#F2E5BF] text-white font-medium truncate min-w-12! max-w-12!">
                                        {report.location_name}
                                    </td>
                                    <td className="px-2 py-3 text-left border-b border-[#F2E5BF] whitespace-nowrap truncate text-sm text-white font-medium min-w-12! max-w-12!">
                                        {formatDate(report.created_at)}
                                    </td>
                                    <td className="px-6 py-4  text-sm font-medium text-white text-center border-b border-[#F2E5BF] min-w-12! max-w-12!">
                                        <button
                                            className="cursor-pointer border text-[#F2E5BF] hover:border-[#CB6040] hover:bg-[#257180] hover:text-white duration-300 px-3 py-1 rounded-xl"
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
