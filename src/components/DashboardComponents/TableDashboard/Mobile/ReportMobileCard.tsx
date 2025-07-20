import React from "react";
import { reporttype_to_string, type ReportData } from "../../../../types/variables";
import { statusColors, useReportDetailHook } from "../../../../hooks/pages/ReportTable/useReportHook";
import { formatDate } from "../../../../utils/other";

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
        <hr className="bg-[#FD8B51] h-0.5 border-none rounded-xl" />
        <div className="text-sm text-white space-y-2 break-all mt-4 *:font-medium">
          <p>
            <span className="font-bold">Nama Pelapor: </span> {report.submitted_by}
          </p>
          <p>
            <span className="font-bold">Laporan: </span>
            {report.message}
          </p>
          <p>
            <span className="font-bold">Lokasi:</span> {report.location_name}
          </p>
          <p>
            <span className="font-bold">Kampus:</span> {report.campus}
          </p>
          <p>
            <span className="font-bold">Status Laporan:</span> <span className={`px-6 py-1 text-xs font-semibold rounded-full truncate ${statusColors[report.status]}`}> {report.status}</span>
          </p>
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
