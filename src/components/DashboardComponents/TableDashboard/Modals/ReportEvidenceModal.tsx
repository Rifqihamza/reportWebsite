import { Image } from "primereact/image";
import { useReportEvidenceHook } from "../../../../hooks/pages/ReportTable/useReportEvidenceHook";
import { useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";

export default function ReportEvidenceModal() {
  const { reportImageURL, setReportImageURL } = useReportEvidenceHook();
  const reportEvidenceElement = useRef<Image|null>(null);

  useEffect(() => {
    if(!reportImageURL || !reportEvidenceElement.current) {
      return;
    }
  }, [reportImageURL]);

  if(!reportImageURL) {
    return <></>;
  }

  return <>
    <Dialog visible={reportImageURL !== null} draggable={false} header={"Bukti Foto"} onHide={() => setReportImageURL(null)}>
      <Image ref={reportEvidenceElement} src={reportImageURL} preview />
    </Dialog>
  </>
}