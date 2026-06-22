import UsePICRankHookEffect, { usePICRankHook } from "../../../../../../hooks/pages/Statistics/usePICRankHook";
import UseUserAccountHookEffect from "../../../../../../hooks/pages/UsersTab/useUserAccount";
import UseReportDataHookEffect from "../../../../../../hooks/shared/useReportData";
import CompactBoxData from "../CompactBoxData";

export default function PICCOmpactData() {
  const { sortedPICData, medianReportData } = usePICRankHook();

  const isReady = sortedPICData.length > 0;
  return (
    <>
      <UseUserAccountHookEffect />
      <UseReportDataHookEffect />
      <UsePICRankHookEffect />
      <CompactBoxData
        loading={!isReady}
        label="MIN"
        value={!isReady ? undefined : sortedPICData[sortedPICData.length - 1].reportCountTotal}
        description="Jumlah laporan paling sedikit yang dimiliki PIC"
        unit="laporan"
      />
      <CompactBoxData loading={!isReady} label="MED" value={!isReady ? undefined : medianReportData} description="Nilai median dari jumlah laporan yang dimiliki PIC" unit="laporan" />
      <CompactBoxData loading={!isReady} label="MAX" value={!isReady ? undefined : sortedPICData[0].reportCountTotal} description="Jumlah laporan paling banyak yang dimiliki PIC" unit="laporan" />
    </>
  );
}
