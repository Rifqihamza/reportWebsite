'use client';
import { useRef, useState } from "react";
import { AccountType, type User } from "../types/variables";
import { Image } from 'primereact/image'
import Dropdown from "./dropdowns";
import { Toast } from 'primereact/toast';
import type { ToastMessage } from 'primereact/toast';

// icon
import PlaceIcon from '@mui/icons-material/Place';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import TrashIcon from '@mui/icons-material/DeleteForever';
import ChevronLeft from "@mui/icons-material/chevronLeft";
import ChevronRight from "@mui/icons-material/chevronRight";

export default function ReportListComponent({ userData }: { userData: User }) {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState("");
  const [disableSave, setDisableSave] = useState(true);
  const [selectDropdown, setSelectDropdown] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | "">("");

  const toastTopRight = useRef<Toast>(null);

  type ReportStatus = "Not Started" | "In Process" | "Complete" | "Hold";
  const reports: Array<{
    id: string;
    created_at: string;
    message: string;
    location: string;
    pic_name: string;
    type: string;
    follow_up: string;
    image: string;
    status: ReportStatus;
  }> = [
      {
        id: "1",
        created_at: "2024-05-01",
        message: "Temuan kebocoran pipa di area workshop",
        location: "Workshop A",
        pic_name: "Suhaimi",
        type: "Safety",
        follow_up: "Guru",
        image: "/img/laporanNew.JPG",
        status: "Not Started",
      },
      {
        id: "2",
        created_at: "2024-04-28",
        message: "Peralatan tidak tertata rapi setelah praktikum",
        location: "Lab Komputer",
        pic_name: "Heas Priyo",
        type: "5R",
        follow_up: "Siswa",
        image: "/img/laporanNew.JPG",
        status: "In Process",
      },
      {
        id: "3",
        created_at: "2024-04-25",
        message: "Material bahan praktik tercecer di lantai",
        location: "Workshop B",
        pic_name: "Amalia",
        type: "5R",
        follow_up: "Siswa",
        image: "/img/laporanNew.JPG",
        status: "Complete",
      },
      {
        id: "4",
        created_at: "2024-04-20",
        message: "AC ruangan tidak berfungsi dengan baik",
        location: "Ruang Teori 3",
        pic_name: "Munir",
        type: "Safety",
        follow_up: "Vendor",
        image: "/img/laporanNew.JPG",
        status: "Hold",
      },
      {
        id: "5",
        created_at: "2024-04-20",
        message: "AC ruangan tidak berfungsi dengan baik",
        location: "Ruang Teori 8",
        pic_name: "Tya",
        type: "Abnormality",
        follow_up: "Vendor",
        image: "/img/laporanNew.JPG",
        status: "Complete",
      },
    ];

  const dropdowns = [

    {
      id: "status",
      label: "Edit Status",
      items: [" Complete", "In Process", "Hold", "Not Started"],
    },
  ];

  // Status color mapping
  const statusColors = {
    "Not Started": "bg-red-100 text-red-800",
    "In Process": "bg-yellow-100 text-yellow-800",
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
    const selectedReport = reports.find(report => report.id === id);
    setDetailId(id);
    setShowDetail(true);
    setSelectedStatus(selectedReport?.status || "");
    setDisableSave(true); // default disable saat pertama buka
  }


  function handle_close() {
    setShowDetail(false);
  }


  const showMessageSave = (ref: React.RefObject<Toast | null>, severity: ToastMessage['severity']) => {
    const summary = "Success";
    const label = "Yeay!, Data Berhasil Disimpan";

    ref.current?.show({ severity: severity, summary: summary, detail: label, life: 3000 });
  };

  const showMessageDelete = (ref: React.RefObject<Toast | null>, severity: ToastMessage['severity']) => {
    const summary = "Success";
    const label = "Data berhasil Dihapus";

    ref.current?.show({ severity: severity, summary: summary, detail: label, life: 3000 });
  };

  const handle_save = () => {
    if (!selectedStatus || selectedStatus === reports.find(r => r.id === detailId)?.status) {
      setDisableSave(true);
      return;
    }

    showMessageSave(toastTopRight, "success");

    setTimeout(() => {
      setShowDetail(false);
    }, 3000);
  };


  const handle_delete = () => {
    const isConfirmed = confirm("Apakah Anda yakin ingin menghapus laporan ini?");
    if (!isConfirmed) return;

    if (selectedStatus === "In Process") {
      alert("Tidak bisa menghapus laporan yang sudah di follow up");
      return;
    }

    showMessageDelete(toastTopRight, "success");

    setTimeout(() => {
      setShowDetail(false);
    }, 3000);
  };

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
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[report.status]
                      }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => { handle_detail(report.id) }}>
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
                className={`px-2 py-1 text-xs font-semibold rounded-full truncate ${statusColors[report.status]
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
              <button className="mobile-detail-button text-white bg-[#7FA1C3] px-2 py-1 rounded-xl text-sm font-medium" onClick={() => { handle_detail(report.id) }}>
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-row justify-between items-center mt-7">
        <div className="flex flex-row justify-center gap-4 w-full">
          <button className="w-fit relative flex flex-row items-center gap-1 justify-center bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300 pr-4 pl-1 py-1 rounded-xl text-white"
          >
            <ChevronLeft fontSize="small" />
            Prev
          </button>
          <button className="w-fit relative flex flex-row items-center gap-1 justify-center bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300 pl-4 pr-1 py-1 rounded-xl text-white"
          >
            Next
            <ChevronRight fontSize="small" />
          </button>
        </div>
      </div>

      {/*  Modal Element */}
      <div className={(showDetail
        ? "bg-black opacity-50 w-full h-full fixed top-0 left-0 right-0 bottom-0 duration-1000 transition-all z-10"
        : "hidden duration-500 transition-all opacity-0")}>
      </div>
      <div className={(showDetail ? "visible pointer-events-auto top-4" : "invisible pointer-events-none top-[50rem] opacity-0") + " left-1/2 translate-y-[0.1rem] -translate-x-1/2 duration-1000 fixed bg-white w-[90vw] max-w-[800px] min-w-[250px] h-fit shadow-lg shadow-gray-600 p-8 box-border flex flex-col gap-4 z-10 rounded-xl"}>
        {(() => {
          const report_data = reports.find(value => value.id == detailId) || reports[0];

          return <>
            <div className=" flex flex-col gap-4">
              <div className="absolute top-1.5 right-1.5">
                <button className="cursor-pointer" onClick={handle_close}>
                  <CloseIcon />
                </button>
              </div>

              {/* header Laporan */}
              <div className="flex md:flex-row md:items-center justify-between flex-row bg-[#7FA1C3] md:px-4 md:py-2 px-3 py-2 rounded-xl">
                <h1 className="font-bold md:text-lg text-sm text-white">{report_data?.message}</h1>
                <span className={`${statusColors[report_data?.status!]} md:text-md md:px-4 md:py-2 text-xs p-1.5 rounded-xl h-fit w-fit whitespace-nowrap`}>{report_data?.status}</span>
              </div>
              <div className="flex flex-col justify-center">
                <Image
                  src={report_data?.image}
                  imageClassName="aspect-[16/9] object-contain rounded-lg w-[500px] md:w-1/2 mx-auto	"
                  alt="Foto Bukti Laporan"
                  preview={true}
                />
                <p className="mx-auto text-xs mt-2">Klik Gambar Untuk Melihat Preview </p>
              </div>

              {/* Isi Laporan */}
              <div className="md:px-8 px-3 space-y-2">

                {/* Location */}
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-2 items-center">
                    <PlaceIcon />
                    <h1 className="md:text-lg text-sm">Lokasi</h1>
                  </div>
                  <p className="font-semibold md:text-lg text-sm">{report_data?.location}</p>
                </div>

                {/* Nama PIC */}
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-2 items-center">
                    <PersonIcon />
                    <h1 className="md:text-lg text-sm">Nama PIC</h1>
                  </div>
                  <p className="font-semibold md:text-lg text-sm">{report_data?.pic_name}</p>
                </div>

                {/* Kategori Laporan */}
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-2 items-center">
                    <CategoryIcon />
                    <h1 className="md:text-lg text-sm">Kategori</h1>
                  </div>
                  <p className="font-semibold md:text-lg text-sm">{report_data?.type}</p>
                </div>

                {/* Follow Up Laporan */}
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-2 items-center">
                    <AssignmentTurnedInIcon />
                    <h1 className="md:text-lg text-sm">Follow Up</h1>
                  </div>
                  <p className="font-semibold md:text-lg text-sm">{report_data?.follow_up}</p>
                </div>
              </div>
            </div >
            {/* Button Action */}
            <div className={`flex flex-col gap-2 w-full mt-2 ${userData.role == AccountType.Guru || userData.role == AccountType.Vendor ? "" : "hidden!"}`}>
              <div className="flex flex-col md:flex-row items-center gap-2 w-full space-y-2 md:space-y-0 ">
                {dropdowns.map((d, index) => (
                  <Dropdown
                    key={index}
                    id={d.id}
                    label={`${d.label}`}
                    items={d.items}
                    onChange={(selectedValue) => {
                      setSelectedStatus(selectedValue as ReportStatus);
                      const currentStatus = report_data?.status;
                      setDisableSave(selectedValue === currentStatus); // disable jika belum berubah
                    }}

                  />
                ))}
                <button
                  className="flex items-center justify-center gap-1 w-full px-6 py-2 text-white rounded-xl bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300 "
                  onClick={handle_delete}
                >
                  <TrashIcon fontSize="small" />
                  Hapus</button>
              </div>
              <div className="mt-2">
                <button
                  disabled={disableSave}
                  className={`rounded-xl flex items-center justify-center gap-1 px-6 py-2 w-full tracking-wide ${disableSave ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'text-black bg-[#E2DAD6] hover:bg-[#e8d6cd] duration-300'}`}
                  onClick={handle_save}>

                  <SaveIcon fontSize="small" />
                  Simpan</button>
              </div>
            </div>
          </>
        })()}
      </div>
      <Toast ref={toastTopRight} position="top-right" />
    </>
  );
}
