import UsePICRankHook, { usePICRankHook } from "../../../../../hooks/pages/Statistics/usePICRankHook";


export default function PICRankTable() {
  const { showedPICData } = usePICRankHook();

  return <>
    <UsePICRankHook />
    <div className="p-4 shadow w-full h-full rounded-2xl">
      <table className="w-full h-full">
        <thead>
          <tr className="">
            <th className="border-b border-gray-300 py-4 text-left w-24">No.</th>
            <th className="border-b border-gray-300 py-4 text-left">Name</th>
            <th className="border-b border-gray-300 py-4 text-left">Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(showedPICData).map(([name, picData], index) => {
            return <tr key={index}>
              <td className="border-b border-gray-300 py-4">{index+1}.</td>
              <td className="border-b border-gray-300 py-4">{name}</td>
              <td className="border-b border-gray-300 py-4">{picData.reportCount}</td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  </>;
}