import UsePICRankHookEffect, { usePICRankHook } from "../../../../../hooks/pages/Statistics/usePICRankHook";


export default function PICRankTable() {
  const { showedPICData, page, maxPage, setPage } = usePICRankHook();

  return <>
    <UsePICRankHookEffect />
    <div className="p-4 shadow w-full h-full rounded-2xl overflow-auto flex flex-col items-center">
      <table className="w-full h-full">
        <thead>
          <tr className="">
            <th className="border-b border-gray-300 py-4 text-left">Rank</th>
            <th className="border-b border-gray-300 py-4 text-left">Nama PIC</th>
            <th className="border-b border-gray-300 py-4 text-left">Total Laporan</th>
            <th className="border-b border-gray-300 py-4 text-left">Laporan Selesai</th>
          </tr>
        </thead>
        <tbody>
          {showedPICData.map((picData, index) => {
            return <tr key={index}>
              <td className="border-b border-gray-300 py-4 min-w-18 max-w-18">{picData.rank}.</td>
              <td className="border-b border-gray-300 py-4 min-w-48 max-w-48">{picData.name}</td>
              <td className="border-b border-gray-300 py-4 min-w-48 max-w-48">{picData.reportCountTotal}</td>
              <td className="border-b border-gray-300 py-4 min-w-48 max-w-48">{picData.reportCountByStatus.Complete}</td>
            </tr>;
          })}
        </tbody>
      </table>
      <div className="mt-4 flex flex-row gap-4">
          <button
            className="disabled:opacity-50 text-white px-2 py-1 rounded-lg bg-gray-600 duration-300 flex flex-row items-center justify-around"
            disabled={page <= 0}
            onClick={() => setPage(page - 1)}
          >
              <i className="pi pi-angle-left"></i>
              Prev
          </button>
          <button
              className="disabled:opacity-50 text-white px-2 py-1 rounded-lg bg-gray-600 duration-300 flex flex-row items-center justify-around"
              disabled={page >= (maxPage - 1)}
              onClick={() => setPage(page + 1)}
          >
              Next
              <i className="pi pi-angle-right"></i>
          </button>
      </div>
    </div>
  </>;
}