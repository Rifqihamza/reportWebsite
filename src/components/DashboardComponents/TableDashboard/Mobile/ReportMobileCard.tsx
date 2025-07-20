import React from "react";
import { reporttype_to_string, type ReportData } from "../../../../types/variables";
import { statusColors, useReportDetailHook } from "../../../../hooks/pages/ReportTable/useReportHook";
import { formatDate, spaces_in_camel_case } from "../../../../utils/other";

interface ReportMobileCardProps {
  report: ReportData;
}

const ReportMobileCard: React.FC<ReportMobileCardProps> = ({ report }) => {
  const { handleDetail } = useReportDetailHook();

  return (
    <div className="report-card relative p-4 rounded-xl bg-[#257180] shadow shadow-gray-400" data-report-id={report.id}>
      <div className="z-50">
        <div className="flex flex-col mb-2 text-center ">
          <h3 className="text-lg lg:text-2xl text-white truncate z-1">
            Laporan terkait <span className="font-semibold">{reporttype_to_string(report.type)}</span>
          </h3>
          <p className="text-xs lg:text-md truncate text-gray-200">{formatDate(new Date(report.created_at).toISOString())}</p>
        </div>
        <hr className="bg-black h-0.5 border-none rounded-xl" />
        <div className="text-sm text-gray-500 space-y-2 break-all mt-4 *:font-medium">
          {Object.entries(table_rows).map(([row, value], index) => {
            if (value === "status") {
              return <p key={index}>
                <span className="font-bold">{row}: </span> <span className={`px-6 py-1 text-xs font-semibold rounded-full truncate ${statusColors[report.status]}`}>{spaces_in_camel_case(report[value])}</span>
              </p>
            }

            return <p key={index}>
              <span className="font-bold">{row}: </span> {report[value]}
            </p>
          })}
        </div>
        <div className="mt-8">
          <button className="mobile-detail-button w-full text-white bg-[#FD8B51] px-3 py-2 rounded-xl text-sm font-medium" onClick={() => handleDetail(report.id)}>
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportMobileCard;
