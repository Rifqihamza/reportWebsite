import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { APIResultType, changeReportStatus, deleteReport, getReport, userLogout } from "../utils/api_interface";
import { AccountType, ReportStatus, ReportType, type ReportData, type User } from "../types/variables";

const reportsPerPage = 5;

export default function ReportListComponent({ userData, reports, setReports }: { userData: User, reports: ReportData[], setReports: Dispatch<SetStateAction<ReportData[]>> }) {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState("");
  

  // Status color mapping
  const statusColors = {
    Pending: "bg-red-100 text-red-800",
    OnProgress: "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
  };

  // Format date helper function
  function formatDate(dateStr: string) {
    // You can use a library like date-fns in a real app
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  function handle_detail(id: string) {
    setDetailId(id);
    setShowDetail(true);
  }

  function handle_close() {
    setShowDetail(false);
  }

  async function handle_delete(id: string) {
    if(userData.role == AccountType.Siswa && !confirm("Are you sure?")) {
      return;
    }
    
    const result = await deleteReport(id);

    if(result == APIResultType.NoError) {
      setShowDetail(false);
      setReports(reports.filter((value) => value.id != id));
    }
    else if(result == APIResultType.InternalServerError) {
      alert("There's an error!");
    }
    else if(result == APIResultType.Unauthorized) {
      alert("You have no access!");
    }
  }

  async function handle_logout() {
    if(!(await userLogout())) {
      alert("There's an error when trying to logout.");
      return;
    }

    window.location.href = "/login";
  }

  async function handle_change_status(id: string, report_status: ReportStatus) {
    const result = await changeReportStatus(id, report_status);

    if(result == APIResultType.NoError) {
      setShowDetail(false);
      setReports(reports.map((value) => value.id == id ? { ...value, status: report_status } : value));
    }
    else if(result == APIResultType.InternalServerError) {
      alert("There's an error!");
    }
    else if(result == APIResultType.Unauthorized) {
      alert("You have no access!");
    }
  }
  

  useEffect(() => {
    getReport().then(report_data_array => {
      if(typeof report_data_array == "object") {
        setReports(report_data_array);
      }
    });
  }, []);

  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

  useEffect(() => {
    setMaxPage(Math.ceil(reports.length / reportsPerPage));
  }, [reports]);

  return (
    <>
      {/* Table for desktop */}
      <div className="px-4 py-2">
        <div className="hidden md:block overflow-scroll border border-gray-300 rounded-xl">
          <table className="min-w-full">
            <thead className="bg-[#7FA1C3]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Laporan
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Lokasi
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider"
                >
                  PIC
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Kategori
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/20 backdrop-blur-md">
              {reports.slice(currentPage*reportsPerPage, (currentPage+1)*reportsPerPage).map((report, index) => {
                return (
                <tr key={index} className="report-row" data-report-id={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(new Date(report.created_at).toISOString())}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-[13rem] truncate">
                    {report.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {report.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.pic_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {report.type == "VR" ? "5R" : report.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[report.status]
                        }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3 disabled:pointer-events-none disabled:opacity-50" onClick={() => { handle_detail(report.id) }} disabled={userData.role == AccountType.Siswa}>
                      Detail
                    </button>
                  </td>
                </tr>
              )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards for mobile */}
      <div className="md:hidden space-y-4">
        {reports.slice(currentPage*reportsPerPage, (currentPage+1)*reportsPerPage).map((report, index) => (
          <div
            key={index}
            className="report-card bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            data-report-id={report.id}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 truncate">{report.message}</h3>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[report.status]
                  }`}
              >
                {report.status}
              </span>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>
                <span className="font-medium">Tanggal:</span> {formatDate(new Date(report.created_at).toISOString())}
              </p>
              <p>
                <span className="font-medium">Lokasi:</span> {report.location}
              </p>
              <p>
                <span className="font-medium">PIC:</span> {report.pic_name}
              </p>
              <p>
                <span className="font-medium">Kategori:</span> {report.type}
              </p>
            </div>
            <div className="mt-3 flex justify-end">
              <button className="mobile-detail-button text-blue-600 hover:text-blue-900 text-sm font-medium" onClick={() => { handle_detail(report.id) }}>
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 md:flex-row justify-between items-center mt-6">
        <div className="flex flex-row gap-2 items-center">
          <button 
            className="disabled:opacity-50 disabled:pointer-events-none rounded-[20px] flex px-6 py-2 w-full text-white bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_10px_0_#E2DAD6] active:[box-shadow:0_5px_0_#E2DAD6] active:-translate-y-[5px]"
            disabled={currentPage <= 0}
            onClick={() => setCurrentPage(currentPage-1)}
          >
            Prev
          </button>
          <button 
            className="disabled:opacity-50 disabled:pointer-events-none rounded-[20px] flex px-6 py-2 w-full text-white bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_10px_0_#E2DAD6] active:[box-shadow:0_5px_0_#E2DAD6] active:-translate-y-[5px]"
            disabled={currentPage >= (maxPage - 1)}
            onClick={() => setCurrentPage(currentPage+1)}
          >
            Next
          </button>
        </div>
        <button className="rounded-[20px] flex px-6 py-2 w-1/5 justify-center text-white bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_10px_0_#E2DAD6] active:[box-shadow:0_5px_0_#E2DAD6] active:-translate-y-[5px]" onClick={handle_logout}>
          Logout
        </button>
      </div>

      {/*  Modal Element */}
      <div className={(showDetail ? "visible pointer-events-auto top-1/2" : "invisible pointer-events-none -top-96") + " left-1/2 -translate-y-1/2 -translate-x-1/2 duration-1000 fixed bg-white w-[90vw] max-w-[800px] min-w-[250px] h-[60dvh] shadow-[0_0_15px_1px_#aaa] p-10 box-border flex flex-col gap-4 z-10 rounded-xl"}>
        {(() => {
            const report_data = reports.find(value => value.id == detailId);

            if(!report_data) {
                return <></>;
            }

            return <>
              <div className="flex flex-col gap-2">
                <h1>Laporan: {report_data?.message}</h1>
                <h1>Status:  <span className={`${statusColors[report_data?.status!]} text-sm p-1 rounded-xl`}>{report_data?.status}</span></h1>
                <br />
                <h1>Tempat:  {report_data?.location}</h1>
                <h1>PIC:  {report_data?.pic_name}</h1>
                <h1>Kategori:  {(report_data?.type == "VR" ? "5R" : report_data?.type)}</h1>
                <h1>Follow Up:  {report_data?.follow_up}</h1>
                <h1>Tanggal Laporan:  {formatDate(new Date(report_data?.report_date).toISOString())}</h1>
                <h1>Tenggat Waktu:  {formatDate(new Date(report_data?.due_date).toISOString())}</h1>
              </div>
              <div className={`gap-2 w-full justify-stretch *:w-full grid md:flex ${userData.role == AccountType.Guru || userData.role == AccountType.Vendor ? "" : "hidden!"}`}>
                <button className="bg-[#7FA1C3] -translate-y-[8px] [box-shadow:0_6px_0_#d1c9b4] active:[box-shadow:0_2px_0_#d1c2b5] active:-translate-y-[3px] text-white p-2 px-4 rounded-2xl" onClick={() => handle_change_status(report_data.id, report_data.status == ReportStatus.OnProgress ? ReportStatus.Completed : ReportStatus.OnProgress)}>{report_data.status == ReportStatus.OnProgress ? "Set Complete" : "Set On Progress"}</button>
                <button className="bg-[#7FA1C3] -translate-y-[8px] [box-shadow:0_6px_0_#d1c9b4] active:[box-shadow:0_2px_0_#d1c2b5] active:-translate-y-[3px] text-white p-2 px-4 rounded-2xl" onClick={() => handle_change_status(report_data.id, ReportStatus.Pending)}>Pending Laporan</button>
                <button className="bg-[#7FA1C3] -translate-y-[8px] [box-shadow:0_6px_0_#d1c9b4] active:[box-shadow:0_2px_0_#d1c2b5] active:-translate-y-[3px] text-white p-2 px-4 rounded-2xl" onClick={() => handle_delete(report_data.id)}>Hapus</button>
              </div>
            </>
        })()}
        <button onClick={handle_close} className="bg-[#7FA1C3] -translate-y-[8px] [box-shadow:0_6px_0_#d1c9b4] active:[box-shadow:0_2px_0_#d1c2b5] active:-translate-y-[3px] text-white p-2 px-4 rounded-2xl">Tutup</button>
      </div>
    </>
  );
}
