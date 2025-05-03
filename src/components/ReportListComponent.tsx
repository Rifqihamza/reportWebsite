export default function ReportListComponent() {
  type ReportStatus = "Pending" | "On Process" | "Complete";
  const reports: Array<{
    id: number;
    tanggal: string;
    laporan: string;
    lokasi: string;
    pic: string;
    kategori: string;
    followup: string;
    status: ReportStatus;
  }> = [
    {
      id: 1,
      tanggal: "2024-05-01",
      laporan: "Temuan kebocoran pipa di area workshop",
      lokasi: "Workshop A",
      pic: "Suhaimi",
      kategori: "Safety",
      followup: "Guru",
      status: "Pending",
    },
    {
      id: 2,
      tanggal: "2024-04-28",
      laporan: "Peralatan tidak tertata rapi setelah praktikum",
      lokasi: "Lab Komputer",
      pic: "Heas Priyo",
      kategori: "5R",
      followup: "Siswa",
      status: "On Process",
    },
    {
      id: 3,
      tanggal: "2024-04-25",
      laporan: "Material bahan praktik tercecer di lantai",
      lokasi: "Workshop B",
      pic: "Amalia",
      kategori: "5R",
      followup: "Siswa",
      status: "Complete",
    },
    {
      id: 4,
      tanggal: "2024-04-20",
      laporan: "AC ruangan tidak berfungsi dengan baik",
      lokasi: "Ruang Teori 3",
      pic: "Munir",
      kategori: "Kualitas",
      followup: "Vendor",
      status: "Complete",
    },
    {
      id: 5,
      tanggal: "2024-04-20",
      laporan: "AC ruangan tidak berfungsi dengan baik",
      lokasi: "Ruang Teori 8",
      pic: "Tya",
      kategori: "Kualitas",
      followup: "Vendor",
      status: "Complete",
    },
  ];

  // Status color mapping
  const statusColors = {
    Pending: "bg-red-100 text-red-800",
    "On Process": "bg-yellow-100 text-yellow-800",
    Complete: "bg-green-100 text-green-800",
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
            {reports.map((report) => (
              <tr className="report-row" data-report-id={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(report.tanggal)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-[13rem] truncate">
                  {report.laporan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {report.lokasi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.pic}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {report.kategori}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusColors[report.status]
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="detail-button text-blue-600 hover:text-blue-900 mr-3">
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
        {reports.map((report) => (
          <div
            className="report-card bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            data-report-id={report.id}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 truncate">{report.laporan}</h3>
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
                <span className="font-medium">Tanggal:</span> {formatDate(report.tanggal)}
              </p>
              <p>
                <span className="font-medium">Lokasi:</span> {report.lokasi}
              </p>
              <p>
                <span className="font-medium">PIC:</span> {report.pic}
              </p>
              <p>
                <span className="font-medium">Kategori:</span> {report.kategori}
              </p>
            </div>
            <div className="mt-3 flex justify-end">
              <button className="mobile-detail-button text-blue-600 hover:text-blue-900 text-sm font-medium">
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex flex-row gap-2 items-center">
          <button className="px-6 py-1 bg-red-900 -translate-y-[8px] [box-shadow:0_6px_0_#d1c9b4] active:[box-shadow:0_2px_0_#d1c2b5] active:-translate-y-[3px] text-white rounded-xl cursor-pointer">
            Prev
          </button>
          <button className="px-6 py-1 bg-red-900 -translate-y-[8px] [box-shadow:0_6px_0_#d1c9b4] active:[box-shadow:0_2px_0_#d1c2b5] active:-translate-y-[3px] text-white rounded-xl cursor-pointer">
            Next
          </button>
        </div>
        <button className="px-6 py-1 bg-red-900 -translate-y-[8px] [box-shadow:0_6px_0_#d1c9b4] active:[box-shadow:0_2px_0_#d1c2b5] active:-translate-y-[3px] text-white rounded-xl cursor-pointer">
          Logout
        </button>
      </div>
    </>
  );
}
