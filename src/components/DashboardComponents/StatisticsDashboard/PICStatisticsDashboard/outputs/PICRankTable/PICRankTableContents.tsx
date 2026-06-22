import UsePICRankHookEffect, { usePICRankHook } from "../../../../../../hooks/pages/Statistics/usePICRankHook";

export default function PICRankTableContents() {
  const { showedPICRank } = usePICRankHook();

  return (
    <>
      <UsePICRankHookEffect />
      {showedPICRank.map((picData, index) => {
        return (
          <tr key={index}>
            <td className="border-b border-gray-300 py-4 px-2 min-w-18 max-w-18">{picData.rank}.</td>
            <td className="border-b border-gray-300 py-4 px-2 min-w-48 max-w-48 truncate">{picData.name}</td>
            <td className="border-b border-gray-300 py-4 px-2 min-w-38 max-w-38">{picData.reportCountTotal}</td>
            <td className="border-b border-gray-300 py-4 px-2 min-w-38 max-w-38">{picData.reportCountByStatus.Complete}</td>
          </tr>
        );
      })}
    </>
  );
}
