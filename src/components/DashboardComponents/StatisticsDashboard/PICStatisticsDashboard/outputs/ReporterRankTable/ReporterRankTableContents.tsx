import { useReporterRankHook } from "../../../../../../hooks/pages/Statistics/useReporterRankHook";
import UseReporterRankHookEffect from "../../../../../../hooks/pages/Statistics/useReporterRankHook";

export default function ReporterRankTableContents() {
  const { showedReporterRank } = useReporterRankHook();

  return (
    <>
      <UseReporterRankHookEffect />
      {showedReporterRank.map((data, index) => {
        return (
          <tr key={index}>
            <td className="border-b border-gray-300 px-2 py-4 min-w-18 max-w-18">{data.rank}</td>
            <td className="border-b border-gray-300 px-2 py-4 min-w-48 max-w-48 truncate">{data.name}</td>
            <td className="border-b border-gray-300 px-2 py-4 min-w-38 max-w-38">{data.totalReports}</td>
          </tr>
        );
      })}
    </>
  );
}
