import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { AccountType, APIResultType, deleteReport, getReport, getUser, ReportStatus, ReportType, userLogout, type ReportData, type User } from "../api/api";

export default function ReportListComponent() {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState("");

  const [reports, setReports]: [ReportData[], Dispatch<SetStateAction<ReportData[]>>] = useState([
    {
      id: "c1i241v13-5v4b62-v1tvdfsc",
      created_at: "2024-05-01T00:00:00",
      message: "Temuan kebocoran pipa di area workshop",
      location: "Workshop A",
      pic_name: "Suhaimi",
      type: ReportType.NoType as ReportType,
      follow_up: AccountType.NoType as AccountType,
      status: ReportStatus.OnProgress as ReportStatus,
    },
  ]);

  const [userData, setUserData]: [User, Dispatch<SetStateAction<User>>] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    role: AccountType.Siswa as AccountType,
    created_at: "",
  });

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

  useEffect(() => {
    getReport().then(report_data_array => {
      if(typeof report_data_array == "object") {
        setReports(report_data_array);
      }
    });

    getUser().then(user_data => {
      if(typeof user_data == "object") {
        setUserData(user_data);
      }
    })
  }, []);


  return (
    <>
      {/* Table for desktop */}
      <div className="hidden md:block overflow-x-auto rounded-xl">
        <table className="min-w-full">
          <thead className="bg-red-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Laporan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Lokasi
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                PIC
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Kategori
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/20 backdrop-blur-md">
            {reports.map((report, index) => (
              <tr key={index} className="report-row" data-report-id={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(report.created_at)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-[13rem] truncate">
                  {report.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {report.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.pic_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {report.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[report.status]}`}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile */}
      <div className="md:hidden space-y-4">
        {reports.map((report, index) => (
          <div
            key={index}
            className="report-card bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            data-report-id={report.id}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 truncate">{report.message}</h3>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  statusColors[report.status]
                }`}
              >
                {report.status}
              </span>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>
                <span className="font-medium">Tanggal:</span> {formatDate(report.created_at)}
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
      <div className="flex flex-col gap-4 md:flex-row items-center justify-between mt-6">
        <div className="flex flex-row gap-2 items-center">
          <button className="px-6 py-1 bg-red-900 -translate-y-[8px] [box-shadow:0_6px_0_#d1c9b4] active:[box-shadow:0_2px_0_#d1c2b5] active:-translate-y-[3px] text-white rounded-xl cursor-pointer">
            Prev
          </button>
          <button className="px-6 py-1 bg-red-900 -translate-y-[8px] [box-shadow:0_6px_0_#d1c9b4] active:[box-shadow:0_2px_0_#d1c2b5] active:-translate-y-[3px] text-white rounded-xl cursor-pointer">
            Next
          </button>
        </div>
        <button className="px-6 py-1 bg-red-900 -translate-y-[8px] [box-shadow:0_6px_0_#d1c9b4] active:[box-shadow:0_2px_0_#d1c2b5] active:-translate-y-[3px] text-white rounded-xl cursor-pointer" onClick={handle_logout}>
          Logout
        </button>
      </div>
      
      {/*  Modal Element */}
      <div className={(showDetail ? "visible pointer-events-auto top-1/2" : "invisible pointer-events-none -top-96") + " left-1/2 -translate-y-1/2 -translate-x-1/2 duration-1000 fixed bg-red-900 *:text-white w-[90vw] max-w-[800px] min-w-[250px] h-[60dvh] shadow-[0_0_8px_5px_#000] p-10 box-border flex flex-col gap-4 z-10 rounded-xl"}>
        {(() => {
            const report_data = reports.find(value => value.id == detailId) || reports[0];

            return <>
              <div className="flex flex-col gap-2">
                <h1>Laporan: {report_data?.message}</h1>
                <h1>Status:  <span className={`${statusColors[report_data?.status!]} text-sm p-1 rounded-xl`}>{report_data?.status}</span></h1>
                <br />
                <h1>Tempat:  {report_data?.location}</h1>
                <h1>PIC:  {report_data?.pic_name}</h1>
                <h1>Kategori:  {report_data?.type}</h1>
                <h1>Follow Up:  {report_data?.follow_up}</h1>
              </div>
              <div className="gap-2 w-full justify-stretch *:w-full grid md:flex">
                <button className="bg-black hover:bg-gray-900 text-white p-2 px-4 rounded-2xl">{report_data?.status == ReportStatus.Completed ? "Set On Progress" : "Set Complete"}</button>
                <button className="bg-black hover:bg-gray-900 text-white p-2 px-4 rounded-2xl">Pending Laporan</button>
                <button className="bg-black hover:bg-gray-900 text-white p-2 px-4 rounded-2xl" onClick={() => handle_delete(report_data.id)}>Hapus</button>
              </div>
            </>
        })()}
        <button onClick={handle_close} className="bg-black text-white p-2 px-4 rounded-2xl hover:bg-gray-900">Tutup</button>
      </div>
    </>
  );
}
