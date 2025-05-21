import { useRef, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { AccountType, ReportStatus, ReportType, reporttype_to_string, string_to_reportstatus, type ReportData, type User } from '../../types/variables';
import { Image } from 'primereact/image'
import { APIResultType, deleteReport } from "../../utils/api_interface";
import { Toast } from 'primereact/toast';
import type { ToastMessage } from 'primereact/toast';
import DialogComponent from "../DialogPopUp/DialogComponent";


const reportsPerPage = 10;

export default function ReportListComponent({ userData, reportData, setReportData, selectedFilter, dateFilter, searchKeyword }: { userData: User | null, reportData: ReportData[], setReportData: Dispatch<SetStateAction<ReportData[]>>, selectedFilter: null | ReportType | ReportStatus, dateFilter: (Date | null)[], searchKeyword: string }) {
  const [detailId, setDetailId] = useState("" as string | null);
  const [selectedStatus, setSelectedStatus] = useState(null as ReportStatus | string | null);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const toastTopRight = useRef<Toast>(null);

  const [showedReportData, setShowedReportData] = useState([] as ReportData[]);

  const statusColors = {
    NotStarted: "bg-red-100 text-red-800",
    InProcess: "bg-yellow-100 text-yellow-800",
    Complete: "bg-green-100 text-green-800",
    Hold: "bg-blue-100 text-blue-800",
  };


  //? ==========> Functions <========== ?//
  function formatDate(dateStr: string) {
    const date = new Date(dateStr);

    // Format date part
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Format time part without "pukul"
    const formattedTime = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return `${formattedDate} ${formattedTime}`;
  }


  function handle_detail(id: string) {
    const selectedReport = reportData.find(report => report.id === id);
    setDetailId(id);
    setIsChange(true); // default disable saat pertama buka
    setSelectedStatus(selectedReport?.status ?? null);
  }

  function handle_close() {
    setDetailId(null);
  }

  async function handle_delete(id: string) {
    if (!userData || userData.role == AccountType.Siswa || !confirm("Are you sure?")) {
      return;
    }
    setDeleteDisabled(true);

    if (reportData.find((data) => data.id == id)?.status === ReportStatus.InProcess) {
      alert("Tidak bisa menghapus laporan yang sudah di follow up");
      setDeleteDisabled(false);
      return;
    }

    const result = await deleteReport(id);

    if (result == APIResultType.NoError) {
      setDetailId(null);
      setReportData(reportData.filter((value) => value.id != id));
      showMessage("Success", toastTopRight, 'success', "Data berhasil dihapus!");
    }
    else if (result == APIResultType.InternalServerError) {
      showMessage("Error", toastTopRight, 'error', "Terjadi error di server!");
    }
    else if (result == APIResultType.Unauthorized) {
      showMessage("Unauthroized!", toastTopRight, 'error', "Akses tidak dikenal!");
    }

    setDeleteDisabled(false);
  }

  const showMessage = (label: string, ref: React.RefObject<Toast | null>, severity: ToastMessage['severity'], detail: string) => {
    ref.current?.show({ severity: severity, summary: label, detail: detail, life: 3000 });
  };

  const [currentPage, setCurrentPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);


  //? ==========> Use Effects <========== ?//
  useEffect(() => {
    const newMaxPage = Math.ceil(showedReportData.length / reportsPerPage);
    setMaxPage(newMaxPage);
    if (currentPage >= newMaxPage) {
      setCurrentPage(0);
    }
  }, [showedReportData]);

  useEffect(() => {
    // Filter Categories and Status
    let result_data = reportData.filter((value) => selectedFilter ? (string_to_reportstatus(selectedFilter) ? value.status == selectedFilter : value.type == selectedFilter) : true);

    // Filter Date
    if (dateFilter && (dateFilter[0] || dateFilter[1])) {
      const max = dateFilter[1] ? dateFilter[1].getTime() + 1000 * 60 * 60 * 24 : null;
      const min = dateFilter[0] ? dateFilter[0].getTime() : null;
      result_data = result_data.filter((value) => {
        const current = new Date(value.created_at).getTime();
        return (max ? current <= max : true) && (min ? current >= min : true);
      });
    }

    // Filter Keyword
    if (searchKeyword) {
      result_data = result_data.filter((value) => {
        const search_data = (value.submitted_by + ":" + value.pic_name + ":" + value.message + ":" + value.location).toLowerCase();
        return search_data.includes(searchKeyword.toLowerCase());
      });
    }

    setShowedReportData(result_data);
  }, [currentPage, selectedFilter, reportData, dateFilter, searchKeyword]);

  useEffect(() => {
    setIsChange(selectedStatus != reportData.find((data) => data.id === detailId)?.status)
  }, [selectedStatus]);


  return (
    <>
      {/* Table for desktop */}
      <div className="hidden md:block overflow-scroll relative border border-gray-300 rounded-xl">
        <table className="w-full h-full min-h-[65vh]">
          <thead>
            <tr>
              <th
                scope="col"
                className="rounded-tl-xl px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
              >
                Tanggal
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
              >
                Nama Pelapor
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
              >
                Laporan
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
              >
                Lokasi
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
              >
                PIC
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
              >
                Kategori
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
              >
                Status
              </th>
              <th
                scope="col"
                className="rounded-tr-xl px-2 py-3 text-center text-sm font-semibold text-white bg-[#7FA1C3] uppercase tracking-wider truncate"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="border-b border-gray-300">
            {showedReportData.length == 0 ? <tr><td className="w-fit" colSpan={8}><h1 className="p-2 opacity-75 text-center">Tidak ada laporan...</h1></td></tr> : showedReportData.slice(currentPage * reportsPerPage, (currentPage + 1) * reportsPerPage).map((report, index) => (
              <tr key={index} className="report-row" data-report-id={report.id}>
                <td className="px-2 py-3 text-center whitespace-nowrap text-sm text-gray-600">
                  {formatDate(report.created_at)}
                </td>
                <td className="px-2 py-3 text-center text-sm text-gray-600 max-w-[13rem] truncate">
                  {report.submitted_by}
                </td>
                <td className="px-2 py-3 text-center text-sm text-gray-600 max-w-[13rem] truncate">
                  {report.message}
                </td>
                <td className="px-2 py-3 text-center whitespace-nowrap text-sm text-gray-600">
                  {report.location}
                </td>
                <td className="px-2 py-3 text-center whitespace-nowrap text-sm text-gray-600">{report.pic_name || "Belum ditentukan"}</td>
                <td className="px-2 py-3 text-center whitespace-nowrap text-sm text-gray-600">
                  {reporttype_to_string(report.type)}
                </td>
                <td className="px-2 py-3 text-center whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[report.status]}`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white text-center">
                  <button className="bg-[#7FA1C3] hover:bg-[#6FA9E3] px-3 py-1 rounded-xl duration-300" onClick={() => { handle_detail(report.id) }}>
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
        {showedReportData.length == 0 ? <h1 className="opacity-75">Tidak ada laporan..</h1> : showedReportData.slice(currentPage * reportsPerPage, (currentPage + 1) * reportsPerPage).map((report, index) => (
          <div
            key={index}
            className="report-card bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            data-report-id={report.id}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg lg:text-2xl text-gray-900 truncate">Details Laporan</h3>
              <p className="font-semibold text-xs lg:text-md truncate">{formatDate(new Date(report.created_at).toISOString())}</p>
            </div>
            <div className="text-sm text-gray-500 space-y-2 break-all">
              <p>
                <span className="font-semibold">Nama Pelapor: </span> {report.submitted_by}
              </p>
              <p>
                <span className="font-semibold">Laporan: </span>{report.message}
              </p>
              <p>
                <span className="font-semibold">Lokasi:</span> {report.location}
              </p>
              <p>
                <span className="font-semibold">PIC:</span> {report.pic_name || "Belum ditentukan"}
              </p>
              <p>
                <span className="font-semibold">Kategori:</span> {reporttype_to_string(report.type)}
              </p>
              <p>
                <span className="font-semibold">Tanggal Temuan:</span> {formatDate(new Date(report.report_date).toISOString())}
              </p>
              <p>
                <span className="font-semibold">Due Date:</span> {report.due_date ? formatDate(new Date(report.due_date).toISOString()) : "Belum ditentukan"}
              </p>
              <p>
                Status Laporan: <span className={`px-6 py-1 text-xs font-semibold rounded-full truncate ${statusColors[report.status]}`}> {report.status}</span>
              </p>
            </div>
            <div className="mt-3 flex justify-end">
              <button className="mobile-detail-button text-white bg-[#7FA1C3] px-3 py-2 rounded-xl text-sm font-medium" onClick={() => { handle_detail(report.id) }}>
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/*  Modal Element */}
      <div className={(detailId
        ? "bg-black/50 z-10 h-full fixed top-0 left-0 right-0 bottom-0 duration-1000 transition-opacity "
        : "duration-1000 transition-opacity hidden")}>
      </div>
      <div className={(detailId ? "visible pointer-events-auto bottom-0" : "invisible pointer-events-none -bottom-[50rem]") + " left-1/2 translate-y-[1rem] -translate-x-1/2 duration-1000 fixed bg-white w-full max-w-[90vw] lg:max-w-[85vw] h-fit lg:max-h-[100vh] max-h-[90vh] p-8 rounded-t-3xl z-10 flex flex-col space-y-5"}>
        {(() => {
          const report_data = reportData.find(value => value.id == detailId) || null;

          const imageComponent = <>
            <div className="flex flex-col justify-center items-center w-fit h-fit">
              <Image
                src={report_data?.image}
                imageClassName="object-contain rounded-lg"
                alt="Foto Bukti Laporan"
                preview={true}
                width="800"
              />
              <p className="mx-auto text-xs mt-2">Klik Gambar Untuk Melihat Preview </p>
            </div>
          </>;

          return <>
            {/* Close Button Modal */}
            <div className="absolute top-4 right-4 md:top-7 md:right-7">
              <button className="cursor-pointer" onClick={handle_close}>
                <i className="pi pi-times p-2"></i>
              </button>
            </div>

            {/* header Laporan */}
            <div className="flex flex-col px-0 py-0 lg:px-6 lg:py-2">
              <h1 className="font-bold lg:text-2xl text-lg text-black tracking-wide">Details Temuan</h1>
              <p>Status: <span className={`${report_data ? statusColors[report_data.status] : ""} md:text-md md:px-2 md:py-1 text-xs p-1.5 rounded-xl h-fit w-fit whitespace-nowrap`}>{report_data?.status}</span>
              </p>
            </div>

            <div className="mt-4 flex flex-col md:flex-row gap-6 mx-4 h-full overflow-auto">
              {/* Image Render */}
              <div>
                {report_data?.image != "" ? imageComponent
                  :
                  <h1 className="opacity-50">Tidak ada gambar untuk laporan ini.</h1>}
              </div>
              {/* Details */}
              <div className="space-y-2 w-full flex flex-col">
                {/* Description Laporan */}
                <div className="flex flex-col items-start ">
                  <h1 className="text-xl font-bold tracking-wide">Deskripsi Laporan</h1>
                  <p className="break-all">{report_data?.message}</p>
                </div>
                <hr />
                {/* Nama Pelapor */}
                <div className="flex flex-col md:flex-row justify-baseline md:justify-between">
                  <h1 className="font-semibold tracking-wide">Pelapor:</h1>
                  <p>{report_data?.submitted_by}</p>
                </div>
                {/* Lokasi Temuan */}
                <div className="flex flex-col md:flex-row justify-baseline md:justify-between">
                  <h1 className="font-semibold tracking-wide">Lokasi:</h1>
                  <p>{report_data?.location}</p>
                </div>
                {/* Kategori Temuan */}
                <div className="flex flex-col md:flex-row justify-baseline md:justify-between">
                  <h1 className="font-semibold tracking-wide">Kategori:</h1>
                  <p>{report_data ? reporttype_to_string(report_data.type) : "N/A"}</p>
                </div>
                {/* Follow Up Temuan */}
                <div className="flex flex-col md:flex-row justify-baseline md:justify-between">
                  <h1 className="font-semibold tracking-wide">Follow Up:</h1>
                  <p className={report_data?.follow_up ? "" : "opacity-50"}>{report_data?.follow_up || "Belum ditentukan"}</p>
                </div>
                {/* Nama PIC */}
                <div className="flex flex-col md:flex-row justify-baseline md:justify-between">
                  <h1 className="font-semibold tracking-wide">Nama PIC:</h1>
                  <p className={report_data?.pic_name ? "" : "opacity-50"}>{report_data?.pic_name || "Belum ditentukan"}</p>
                </div>
                {/* Tanggal Temuan */}
                <div className="flex flex-col md:flex-row justify-baseline md:justify-between">
                  <h1 className="font-semibold tracking-wide ">Tanggal Temuan:</h1>
                  <p>{report_data?.report_date ? formatDate(report_data.report_date) : 'N/A'}</p>
                </div>
                {/* Tanggal Dilakukan Temuan */}
                <div className="flex flex-col md:flex-row justify-baseline md:justify-between">
                  <h1 className="font-semibold tracking-wide">Due Date:</h1>
                  <p className={report_data?.due_date ? "" : "opacity-50"}>{report_data?.due_date || "Belum ditentukan"}</p>
                </div>
                {/* Follow up oleh */}
                <div className="flex flex-col md:flex-row justify-baseline md:justify-between">
                  <h1 className="font-semibold tracking-wide ">Follow Up Oleh:</h1>
                  <p className={report_data?.follow_up_name ? "" : "opacity-50"}>{report_data?.follow_up_name || "Belum ditentukan"}</p>
                </div>
              </div>
              {/* End Details */}
            </div>
            {/* Action Button for Data */}
            <div className={`grid grid-cols-2 gap-4 w-full pt-4 ${(userData && (userData.role == AccountType.Guru || userData.role == AccountType.Vendor)) ? "" : "hidden!"}`}>
              <button className="disabled:opacity-50 flex items-center justify-center gap-1 w-full px-2 py-3 text-white rounded-xl bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed" onClick={() => setDialogVisible(true)}>
                Edit
              </button>
              <button className="disabled:opacity-50 flex items-center justify-center gap-1 w-full px-2 py-3 text-white rounded-xl bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed" onClick={() => report_data ? handle_delete(report_data.id) : ""} disabled={saveDisabled || deleteDisabled}>
                {deleteDisabled ? <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem', marginRight: '10px' }}></i> : ""}
                Hapus
              </button>
            </div >
            {/* End Action Button */}
          </>;
        })()}
      </div >

      {/* Dialog Components */}
      <DialogComponent
        userData={userData}
        reportData={reportData}
        setReportData={setReportData}
        dateFilter={dateFilter}
        searchKeyword={searchKeyword}
        detailId={detailId}
        visible={dialogVisible}
        setVisible={setDialogVisible}
        onSuccess={() => { showMessage("Success", toastTopRight, "success", "Successfully update data!"); }}
        onUnauthorized={() => { showMessage("Unauthorized", toastTopRight, "error", "Unauthorized attempt detected!"); }}
        onError={() => { showMessage("Error", toastTopRight, "error", "There's an error!"); }}
      />
      {/* End Dialog Components */}

      <Toast ref={toastTopRight} position="top-right" />

      {/* Pagination */}
      <div className="flex flex-row items-center mt-2">
        <div className="flex flex-row justify-evenly md:justify-start gap-2 w-full">
          <button
            className="disabled:opacity-50 text-white px-2 py-1 rounded-lg bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300 flex flex-row items-center justify-around"
            disabled={currentPage <= 0}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <i className="pi pi-angle-left"></i>
            Prev
          </button>
          <button
            className="disabled:opacity-50 text-white px-2 py-1 rounded-lg bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300 flex flex-row items-center justify-around"
            disabled={currentPage >= (maxPage - 1)}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
            <i className="pi pi-angle-right"></i>
          </button>
        </div>
        {/* End Pagination */}
      </div>
    </>
  );
}