import { usePICRankHook } from "../../../../../hooks/pages/Statistics/usePICRankHook";
import CompactBoxData from "./CompactBoxData";

export default function PICCOmpactData() {
  const { sortedPICData, medianReportData } = usePICRankHook();

  const isReady = sortedPICData.length > 0;
  return <>
    <div className="flex flex-col md:flex-row gap-2">
      <CompactBoxData loading={!isReady} label="MIN" value={!isReady ? undefined : sortedPICData[sortedPICData.length - 1].reportCountTotal} description="Jumlah laporan paling sedikit yang dimiliki PIC" unit="laporan" />
      <CompactBoxData loading={!isReady} label="MED" value={!isReady ? undefined : medianReportData} description="Nilai median dari jumlah laporan yang dimiliki PIC"  unit="laporan" />
      <CompactBoxData loading={!isReady} label="MAX" value={!isReady ? undefined : sortedPICData[0].reportCountTotal} description="Jumlah laporan paling banyak yang dimiliki PIC"  unit="laporan" />
    </div>
  </>
}