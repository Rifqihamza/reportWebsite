import { useInsightHook } from "../../../../../hooks/pages/Statistics/useChartHook";
import { useReportDataHook } from "../../../../../hooks/shared/useReportData";
import { reporttype_to_string } from "../../../../../types/variables";

export default function InsightsComponent() {
  const { insight } = useInsightHook();
  const { reportData } = useReportDataHook();

  if (!reportData || reportData.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-white opacity-50">Tidak ada laporan yang bisa dianalisis</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-white">
        {!insight ? (
          "Membuat insight.."
        ) : (
          <ol className="list-decimal m-4">
            <li>
              Terdapat <b>{insight.totalReportAllTime} temuan selama ini</b> dan <b>{insight.totalReportThisMonth} diantara nya terjadi pada bulan ini.</b>
            </li>
            <li>
              Grafik menunjukkan bahwa <b>laporan temuan bulan ini {insight.betterThanLastMonth ? "lebih sedikit" : "lebih banyak"} dari bulan sebelumnya.</b>
            </li>
            <li>
              Selama ini, <b>Kategori {reporttype_to_string(insight.highestOccuranceCategory)} paling sering muncul</b> dibandingkan dengan kategori yang lain.
            </li>
            <li>
              <b>Hari yang sering terjadi temuan adalah hari {insight.highestOccuranceDay}</b>.
            </li>
            <li>
              {insight.notCompletedReportPreviousMonth > 0 ? (
                <>
                  Ada{" "}
                  <b>
                    {insight.notCompletedReportPreviousMonth.toString() +
                      " laporan temuan yang belum terselesaikan di bulan lalu. Itu sekitar " +
                      Math.round((insight.notCompletedReportPreviousMonth * 100) / (insight.totalReportAllTime - insight.totalReportThisMonth)).toString() +
                      "% dari keseluruhan laporan!"}
                  </b>
                </>
              ) : (
                <b>Semua temuan bulan lalu sudah terselesaikan semua!</b>
              )}
            </li>
            {Object.keys(insight.totalReportPerPIC).length > 2 ? (
              <>
                {(() => {
                  const sortedReportPerPICEntries = Object.entries(insight.totalReportPerPIC).sort((a, b) => a[1] - b[1]);
                  return (
                    <li>
                      PIC dengan temuan paling sedikit adalah <b>{sortedReportPerPICEntries[0][0]}</b>. Sedangkan yang paling banyak adalah{" "}
                      <b>{sortedReportPerPICEntries[sortedReportPerPICEntries.length - 1][0]}</b>
                    </li>
                  );
                })()}
              </>
            ) : (
              ""
            )}
          </ol>
        )}
      </div>
    </>
  );
}
