import { Image } from "primereact/image";
import { useReportEvidenceHook } from "../../../../hooks/pages/ReportTable/useReportEvidenceHook";
import { useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { PrimeReactProvider } from "primereact/api";

export default function ReportEvidenceModal() {
  const { reportImageURL, setReportImageURL } = useReportEvidenceHook();
  const reportEvidenceElement = useRef<Image | null>(null);

  useEffect(() => {
    if (!reportImageURL || !reportEvidenceElement.current) {
      return;
    }
  }, [reportImageURL]);

  if (!reportImageURL) {
    return <></>;
  }

  return (
    <PrimeReactProvider>
      <Dialog
        visible={reportImageURL !== null}
        draggable={false}
        header={"Bukti Foto"}
        onHide={() => setReportImageURL(null)}
        headerClassName="bg-[#374151]! text-white!"
        contentClassName="bg-[#1a1d24]! p-2! md:p-10!"
      >
        <div className="max-w-[70vmin] min-w-[50vmin] overflow-hidden">
          <Image ref={reportEvidenceElement} src={reportImageURL} preview className="" imageClassName="object-cover rounded-lg w-full aspect-square" />
        </div>
      </Dialog>
    </PrimeReactProvider>
  );
}
