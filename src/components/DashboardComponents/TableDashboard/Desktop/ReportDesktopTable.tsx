import { reporttype_to_string, statusColorHex, table_rows } from '../../../../types/variables';
import { useReportDetailHook, useReportPaginationHook, statusColors } from "../../../../hooks/pages/ReportTable/useReportHook";
import { spaces_in_camel_case } from "../../../../utils/other";
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
        <div className='hidden md:block overflow-auto p-5 bg-[#374151] rounded-xl'>
            <table className="w-full relative min-h-48">
                <thead>
                    <tr>
                        {Object.keys(table_rows).map((key) => {
                            return <th
                                key={key}
                                scope="col"
                                className="rounded-tl-xl px-2 py-3 border-b border-[#F97316] text-left text-sm font-semibold text-white uppercase tracking-wider truncate"
                            >
                                {key}
                            </th>;
                        })}
                        <th
                            scope="col"
                            className="rounded-tr-xl px-2 py-3 border-b border-[#F97316] text-center text-sm font-semibold text-white uppercase tracking-wider truncate"
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
                                <tr key={index} data-report-id={report.id}>
                                    {Object.values(table_rows).map((value, index) => {
                                        if (value === "status") {
                                            return <td key={index} className="px-2 py-3 text-left border-b border-[#F97316] whitespace-nowrap text-sm text-white truncate min-w-20! max-w-20!">
                                                <span
                                                    style={{ backgroundColor: statusColorHex[report.status] }}
                                                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                                >
                                                    {spaces_in_camel_case(report.status)}
                                                </span>
                                            </td>;
                                        }

                                        let isSpecified = report[value] !== null;
                                        return <td key={index} className={`px-2 py-3 text-left border-b border-[#F97316] text-sm text-white truncate min-w-24! max-w-24! ${isSpecified || "opacity-50"}`}>
                                            {isSpecified ? (report[value] as string) : "Belum Ditentukan"}
                                        </td>;
                                    })}

                                    <td className="px-6 py-4  text-sm font-medium text-white text-center border-b border-[#F97316] min-w-12! max-w-12!">
                                        <button
                                            className="cursor-pointer border text-white hover:[box-shadow:0_0_4px_2px_#f2e5bf] duration-300 px-3 py-1 rounded-xl"
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
