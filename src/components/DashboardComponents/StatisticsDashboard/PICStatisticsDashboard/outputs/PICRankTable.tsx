import UsePICRankHookEffect, { usePICRankHook } from "../../../../../hooks/pages/Statistics/usePICRankHook";


export default function PICRankTable() {
  const { showedPICData } = usePICRankHook();

  return <>
    <UsePICRankHookEffect />
    <div className="p-4 shadow w-full h-full rounded-2xl overflow-auto">
      <table className="w-full h-full">
        <thead>
          <tr className="">
            <th className="border-b border-gray-300 py-4 text-left min-w-18 max-w-18">Rank</th>
            <th className="border-b border-gray-300 py-4 text-left min-w-48 max-w-48">Nama PIC</th>
            <th className="border-b border-gray-300 py-4 text-left min-w-48 max-w-48">Total Laporan</th>
            <th className="border-b border-gray-300 py-4 text-left min-w-48 max-w-48">Laporan Selesai</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(showedPICData).sort((a, b) => (b[1].reportCountTotal - a[1].reportCountTotal)).map(([name, picData], index) => {
            return <tr key={index}>
              <td className="border-b border-gray-300 py-4">{index+1}.</td>
              <td className="border-b border-gray-300 py-4">{name}</td>
              <td className="border-b border-gray-300 py-4">{picData.reportCountTotal}</td>
              <td className="border-b border-gray-300 py-4">{picData.reportCountByStatus.Complete}</td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  </>;
}