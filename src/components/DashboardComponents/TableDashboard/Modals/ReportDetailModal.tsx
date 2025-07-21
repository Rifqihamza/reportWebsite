import React, { useEffect, useRef, useState } from "react";
import { Image } from "primereact/image";
import { AccountAPIPrivillage, reporttype_to_string } from "../../../../types/variables";
import { useReportDataHook } from "../../../../hooks/shared/useReportData";
import { statusColors, useReportDetailHook, useReportEditHook } from "../../../../hooks/pages/ReportTable/useReportHook";
import { formatDate } from "../../../../utils/other";
import { Accordion, AccordionTab } from "primereact/accordion";
import { PrimeReactProvider } from "primereact/api";
import { useUserDataHook } from "../../../../hooks/shared/useUserData";

export default function ReportDetailModal() {
  const [accordionIndex, setAccordionIndex] = useState(0);

  const { reportData } = useReportDataHook();
  const { detailId, deleteDisabled, handleClose, handleDelete } = useReportDetailHook();

  const { setEditVisible } = useReportEditHook();
  const { userPrivillages: userDataPrivillages } = useUserDataHook();

  const report_data = reportData?.find((value) => value.id === detailId) || null;
  const backgroundElement = useRef(null as HTMLDivElement | null);

  const closeOnBlank = () => {
    handleClose();
  };

  // Close detail modal after tapping background
  useEffect(() => {
    if (!backgroundElement.current) {
      return;
    }

    backgroundElement.current.addEventListener("click", closeOnBlank);
    return () => {
      if (backgroundElement.current) {
        backgroundElement.current.removeEventListener("click", closeOnBlank);
      }
    };
  }, [backgroundElement]);

  const ImageComponent = () => (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Image src={report_data?.image} imageClassName="object-cover rounded-lg max-h-[50vh]" alt="Foto Bukti Laporan" preview={true} width="600" loading="lazy" />
      <p className="mx-auto text-xs mt-2 text-gray-400">Klik Gambar Untuk Melihat Preview</p>
    </div>
  );

  return (
    <>
      <PrimeReactProvider>
        {/* Modal backdrop */}
        <div ref={backgroundElement} className={`bg-black/70 z-20 h-full fixed top-0 left-0 right-0 bottom-0 duration-1000 transition-opacity ${!detailId && "hidden"}`} />

        {/* Modal content */}
        <div
          className={
            (detailId ? "visible pointer-events-auto top-0 scale-100 opacity-100" : "invisible pointer-events-none top-0 scale-50 opacity-0") +
            " left-1/2 translate-y-[2rem] -translate-x-1/2 duration-200 fixed bg-white w-full max-w-[90vw] lg:max-w-[85vw] " +
            "lg:max-h-[100vh] min-h-[90vh] max-h-[90vh] overflow-y-auto px-4 p-8 rounded-3xl z-50 flex flex-col justify-between space-y-5"
          }
        >
          {/* Close Button Modal */}
          <div className="absolute top-4 right-4 md:top-7 md:right-7">
            <button className="cursor-pointer text-gray-600 bg-white shadow shadow-gray-500 rounded-full hover:ring-8 hover:ring-gray-200 duration-400" onClick={handleClose}>
              <i className="pi pi-times p-2"></i>
            </button>
          </div>

          {/* Header Laporan */}
          <div className="flex flex-col px-0 py-0 lg:px-6 lg:py-2 text-gray-600">
            <h1 className="font-bold lg:text-2xl text-lg tracking-wide">Detail Temuan</h1>
            <p>
              Status:
              <span className={`${report_data ? statusColors[report_data.status] : ""} font-medium uppercase md:text-md md:px-2 md:py-1 text-xs p-1.5 rounded-xl h-fit w-fit whitespace-nowrap ml-2`}>
                {report_data?.status}
              </span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mx-4 h-max">
            {/* Image Render */}
            <div>{report_data?.image ? <ImageComponent /> : <h1 className="opacity-50">Tidak ada gambar untuk laporan ini.</h1>}</div>

            {/* Details */}
            <div className="w-full flex flex-col gap-5">
              <Accordion activeIndex={accordionIndex} onTabChange={(e) => setAccordionIndex(Array.isArray(e.index) ? e.index[0] : e.index)} className="">
                <AccordionTab header="Pesan Laporan" className={`${accordionIndex == 0 && "md:pointer-events-none"} [&.p-toggleable-content]:*:h-[30vh] [&_.p-accordion-header-link]:bg-[#1f324d]! [&_.p-accordion-header-link]:text-white! [&_.p-accordion-header-link]:rounded-xl! [&_.p-accordion-content]:mt-4! [&_.p-accordion-content]:mb-4! [&_.p-accordion-content]:rounded-xl! [&_.p-accordion-content]:[box-shadow:0_0_4px_2px_#eee]!`}>
                  <p className="break-words whitespace-pre-line w-full overflow-y-auto overflow-x-auto">{report_data?.message}</p>
                </AccordionTab>
                <AccordionTab
                  header="Detail Laporan"
                  className={`${accordionIndex == 1 && "md:pointer-events-none"} [&.p-toggleable-content]:*:h-[30vh] [&_.p-accordion-content]:overflow-y-auto [&_.p-accordion-header-link]:bg-[#1f324d]! [&_.p-accordion-header-link]:text-white! [&_.p-accordion-header-link]:rounded-xl! [&_.p-accordion-content]:mt-4! [&_.p-accordion-content]:mb-4! [&_.p-accordion-content]:rounded-xl! [&_.p-accordion-content]:[box-shadow:0_0_4px_2px_#eee]!`}
                >
                  <div className="w-full flex flex-col space-y-2 overflow-y-auto">
                    {/* Report Details */}
                    <DetailField label="Pelapor:" value={report_data?.submitted_by} />
                    <DetailField label="Kampus:" value={report_data?.campus} />
                    <DetailField
                      label="Lokasi:" value={<><b>{report_data?.location_name}</b>{report_data?.detail_location ? `, ${report_data.detail_location}` : ""}</>} />
                    <DetailField label="Kategori:" value={report_data ? reporttype_to_string(report_data.type)! : ""} />
                    <DetailField label="Nama PIC:" value={report_data?.pic_name} fallback="Belum ditentukan" />
                    <DetailField label="Follow Up Oleh:" value={report_data?.follow_up_name} fallback="Belum ditentukan" />
                    <DetailField label="Jenis Follow Up:" value={report_data?.follow_up} fallback="Belum ditentukan" />
                    <DetailField label="Tanggal Temuan:" value={report_data ? formatDate(report_data.report_date) : ""} fallback="Belum ditentukan" />
                    <DetailField label="Tenggat Waktu:" value={report_data?.due_date ? formatDate(report_data.due_date) : undefined} fallback="Belum ditentukan" />
                  </div>
                </AccordionTab>
              </Accordion>
            </div>
            {/* End Details */}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full pt-4">
            <button
              className="uppercase font-medium tracking-widest disabled:opacity-50 flex items-center justify-center gap-1 w-full px-2 py-3 rounded-xl border text-[#1f324d] hover:bg-[#1f324d] hover:text-white hover:boder-white duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              onClick={() => setEditVisible(true)}
              disabled={!userDataPrivillages.includes(AccountAPIPrivillage.UpdateReport)}
            >
              Edit
            </button>
            <button
              className="uppercase font-medium tracking-widest disabled:opacity-50 flex items-center justify-center gap-1 w-full px-2 py-3 rounded-xl border text-[#1f324d] hover:bg-[#1f324d] hover:text-white hover:boder-white duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              onClick={() => (report_data ? handleDelete(report_data.id) : null)}
              disabled={deleteDisabled || !userDataPrivillages.includes(AccountAPIPrivillage.DeleteReport)}
            >
              {deleteDisabled && <i className="pi pi-spin pi-spinner" style={{ fontSize: "1rem", marginRight: "10px" }}></i>}
              Hapus
            </button>
          </div>
        </div>
      </PrimeReactProvider>
    </>
  );
}

// Helper component for detail fields
const DetailField: React.FC<{ label: string; value?: React.ReactNode | null; fallback?: string }> = ({ label, value, fallback }) => (
  <div className="flex flex-col md:flex-row justify-baseline md:justify-between">
    <h1 className="font-semibold tracking-wide">{label}</h1>
    <p className={value ? "" : "opacity-50"}>{value || fallback || "N/A"}</p>
  </div>
);
