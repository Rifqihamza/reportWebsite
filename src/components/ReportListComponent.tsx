import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { AccountType, ReportStatus, string_to_reportstatus, type ReportData, type User } from '../types/variables';
import { Image } from 'primereact/image'
import Dropdown from "./dropdowns";import { APIResultType, changeReportStatus, deleteReport, getReport, userLogout } from "../utils/api_interface";

const reportsPerPage = 5;

export default function ReportListComponent({ userData, reports, setReports }: { userData: User, reports: ReportData[], setReports: Dispatch<SetStateAction<ReportData[]>> }) {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null as ReportStatus | null);
  
  
  const dropdowns = [
    {
      id: "status",
      label: "Edit Status",
      items: Object.values(ReportStatus),
    },
  ];

  // Status color mapping
  const statusColors = {
    NotStarted: "bg-red-100 text-red-800 truncate",
    InProcess: "bg-yellow-100 text-yellow-800 truncate",
    Complete: "bg-green-100 text-green-800",
    Hold: "bg-blue-100 text-blue-800",
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
  }, []);

  
  async function handle_save(id: string) {
    if(!selectedStatus) {
        return;
    }

    const result = await changeReportStatus(id, selectedStatus);

    if(result == APIResultType.NoError) {
      setShowDetail(false);
      setReports(reports.map((value) => value.id == id ? { ...value, status: selectedStatus } : value));
    }
    else if(result == APIResultType.InternalServerError) {
      alert("There's an error!");
    }
    else if(result == APIResultType.Unauthorized) {
      alert("You have no access!");
    }
  }

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

  useEffect(() => {
    setMaxPage(Math.ceil(reports.length / reportsPerPage));
  }, [reports]);

  return (
    <>
      {/* Table for desktop */}
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
            {reports.slice(currentPage*reportsPerPage, (currentPage+1)*reportsPerPage).map((report, index) => (
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
            ))}
          </tbody>
        </table>
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
      <div className="flex flex-row justify-between items-center mt-5">
        <div className="flex flex-row gap-4 md:max-w-[15rem] w-full">
          <button 
            className="w-full justify-center disabled:opacity-50 disabled:pointer-events-none rounded-[20px] flex px-3 py-0.5 text-white bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_6px_0_#E2DAD6] active:[box-shadow:0_2px_0_#E2DAD6] active:-translate-y-[5px]"
            disabled={currentPage <= 0}
            onClick={() => setCurrentPage(currentPage-1)}
          >
            Prev
          </button>
          <button 
            className="w-full justify-center disabled:opacity-50 disabled:pointer-events-none rounded-[20px] flex px-3 py-0.5 text-white bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_6px_0_#E2DAD6] active:[box-shadow:0_2px_0_#E2DAD6] active:-translate-y-[5px]"
            disabled={currentPage >= (maxPage - 1)}
            onClick={() => setCurrentPage(currentPage+1)}
          >
            Next
          </button>
        </div>
        <button className="w-32 justify-center rounded-[20px] md:flex hidden px-3 py-0.5 text-white bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_6px_0_#E2DAD6] active:[box-shadow:0_2px_0_#E2DAD6] active:-translate-y-[5px]" onClick={handle_logout}
        >
          Logout
        </button>
      </div>

      {/*  Modal Element */}
      <div className={(showDetail
        ? "bg-black/30 w-full h-full fixed top-0 left-0 right-0 bottom-0 duration-500 transition-all z-10"
        : "hidden duration-500 transition-all")}>
      </div>
      <div className={(showDetail ? "visible pointer-events-auto top-4" : "invisible pointer-events-none top-[50rem]") + " left-1/2 translate-y-[0.1rem] -translate-x-1/2 duration-1000 fixed bg-white w-[90vw] max-w-[800px] min-w-[250px] h-fit shadow-lg shadow-gray-600 md:p-14 p-8 box-border flex flex-col gap-4 z-10 rounded-xl"}>

        {(() => {
            const report_data = reports.find(value => value.id == detailId) || reports[0];

            if(!report_data) {
                return <></>;
            }

            const imageComponent = <>
                <div className="flex flex-col justify-center">
                    <Image
                    src={report_data?.image}
                    imageClassName="aspect-[16/9] object-contain rounded-lg w-[500px] md:w-1/2 mx-auto	"
                    alt="Foto Bukti Laporan"
                    preview={true}
                    />
                    <p className="mx-auto text-xs mt-2">Klik Gambar Untuk Melihat Preview </p>
              </div>
            </>;
            
          return <>
            <div className="relative flex flex-col gap-2 md:gap-4">
            <div className="fixed top-3 left-3">
              <button
              onClick={() => handle_save(report_data.id)}
              className="rounded-[20px] flex items-center justify-center px-3 py-1 w-full text-white bg-[#7291af] hover:bg-[#6299be] duration-300 tracking-wide"
              >Simpan</button>
            </div>
              <div className="fixed top-3 right-3">
                <button onClick={handle_close}>
                  <svg
                    className="w-8 h-auto p-2 border rounded-full"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L9 9M1 9L9 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* header Laporan */}
              <div className="flex md:flex-row md:items-center md:justify-between md:gap-0 md:mt-0 flex-row gap-2 mt-2 bg-[#7FA1C3] md:px-4 md:py-2 px-3 py-2 rounded-2xl">
                <h1 className="font-bold md:text-lg text-sm text-white">{report_data?.message}</h1>
                <span className={`${statusColors[report_data?.status!]} md:text-md md:px-4 md:py-2 text-xs px-3 rounded-xl`}>{report_data?.status}</span>
              </div>
              {report_data?.image != "" ? imageComponent : <h1 className="opacity-50">Tidak ada gambar untuk laporan ini.</h1>}

              {/* Isi Laporan */}
              <div className="md:px-8 px-3 space-y-2">

                {/* Location */}
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-2 items-center">
                    <img src="/locationIcon.svg" alt="" className="w-4 h-auto md:w-5 md:h-5" />
                    <h1 className="md:text-lg text-sm">Lokasi</h1>
                  </div>
                  <p className="font-semibold md:text-lg text-sm">{report_data?.location}</p>
                </div>

                {/* Nama PIC */}
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-2 items-center">
                    <img src="/avatarIcon.svg" alt="" className="w-4 h-auto md:w-5 md:h-5" />
                    <h1 className="md:text-lg text-sm">Nama PIC</h1>
                  </div>
                  <p className="font-semibold md:text-lg text-sm">{report_data?.pic_name}</p>
                </div>

                {/* Kategori Laporan */}
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-2 items-center">
                    <img src="/categoryIcon.svg" alt="" className="w-4 h-auto md:w-5 md:h-5" />
                    <h1 className="md:text-lg text-sm">Kategori</h1>
                  </div>
                  <p className="font-semibold md:text-lg text-sm">{report_data?.type}</p>
                </div>

                {/* Follow Up Laporan */}
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-2 items-center">
                    <img src="/followUpIcon.svg" alt="" className="w-4 h-auto md:w-5 md:h-5" />
                    <h1 className="md:text-lg text-sm">Follow Up</h1>
                  </div>
                  <p className="font-semibold md:text-lg text-sm">{report_data?.follow_up}</p>
                </div>
              </div>
            </div >
            {/* Button Action */}
            <div className={`mt-4 space-y-4 md:space-y-0 gap-2 w-full justify-row items-center *:w-full grid md:flex ${userData.role == AccountType.Guru || userData.role == AccountType.Vendor ? "" : "hidden!"}`}>
              {dropdowns.map((d, index) => (
                <Dropdown key={index} id={d.id} label={`${d.label}`} items={d.items} onChange={(value) => setSelectedStatus(string_to_reportstatus(value)!)} />
              ))}
              <button className="rounded-[20px] flex items-center justify-center px-6 py-2 w-full text-black bg-[#E2DAD6] -translate-y-[10px] [box-shadow:0_10px_0_#7FA1C3] active:[box-shadow:0_5px_0_#7FA1C3] active:-translate-y-[5px] tracking-wide" onClick={() => handle_delete(report_data.id)}>Hapus</button>
            </div>
          </>
        })()}
      </div>
    </>
  );
}
