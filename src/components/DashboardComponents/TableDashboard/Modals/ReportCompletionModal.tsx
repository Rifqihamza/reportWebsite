import { Dialog } from "primereact/dialog";
import { useReportCompletionHook } from "../../../../hooks/pages/ReportTable/useReportCompletionHook";
import { useEffect, useState } from "react";
import { useMessageToastHook } from "../../../../hooks/shared/useMessageToast";
import { APIResultType, markCompleteReport } from "../../../../utils/api_interface";


export default function ReportCompletionModal() {
  const { reportId, setReportId } = useReportCompletionHook();
  const { showMessage } = useMessageToastHook();

  const [image, setImage] = useState<File|null>(null);
  const [disableComplete, setDisableComplete] = useState(false);

  async function setReportComplete() {
    if(!reportId) {
      setReportId(null);
      return;
    }
    
    if(!image) {
      showMessage("Mohon isi gambar sebagai bukti selesai.", "warn");
      return;
    }

    setDisableComplete(true);

    try {
      const result = await markCompleteReport(reportId, image);
      if(result === false) {
        showMessage("Terjadi error!", "error", "Mohon maaf, terjadi kesalahan.");
      }
      else if(typeof result === "object") {
        showMessage("Sukses!", "success", "Sukses menandai \"laporan telah selesai\"");
        setReportId(null);
      }
      else {
        switch(result) {
          case APIResultType.DatabaseError:
            showMessage("Gagal menandai laporan", "error", "Tidak dapat terhubung dengan database. Silahkan coba lagi nanti.");
          case APIResultType.NeedCaptchaAuthentication:
            window.location.reload();
          case APIResultType.InternalServerError:
            showMessage("Gagal menandai laporan", "error", "Terjadi kesalah server. Silahkan coba lagi nanti.");
          case APIResultType.Unauthorized:
            showMessage("Tidak mempunyai akses", "error", "Tidak mempunyai akses untuk menandai selesai.");
        }
      }
    }
    catch(e) {
      showMessage("Terjadi error!", "error", "Mohon maaf, terjadi kesalahan.");
      console.error(e);
    }
    finally {
      setDisableComplete(false);
    }
  }

  const isOpen = reportId !== null;

  return <>
    <Dialog 
      visible={isOpen} 
      onHide={() => setReportId(null)}
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={() => setReportId(null)} className="text-gray-800 hover:text-gray-200">
            Batal
          </button>
          <button onClick={setReportComplete} disabled={disableComplete} className="text-blue-400 hover:text-gray-600 disabled:text-gray-800 disabled:opacity-50 disabled:pointer-events-none">
            {disableComplete && <i className="pi pi-spinner pi-spin mr-2" />}
            Simpan
          </button>
        </div>
      }
      header={"Upload Bukti Foto"}
      >
      <div className="flex items-center justify-center w-full z-10">
        <label
          htmlFor="foto"
          className="cursor-pointer outline-none px-6 py-8 w-full bg-[#E2DAD6] border-2 border-[#314f79] hover:bg-neutral-50 duration-300 rounded-2xl focus:shadow-inner focus:shadow-gray-400 focus:duration-300 focus:ease"
        >
          <div className="flex flex-col items-center justify-center">
            <i className="pi pi-cloud text-black" />
            <p className={`mb-1 text-sm text-${image ? "black" : "black"}`} id="file-name-display">
              {image ? image.name : "Klik untuk upload foto"}
            </p>
            <p className={`text-xs text-${image ? "black" : "black"}`}>{image ? `${image.type} (${(image.size.toString().length > 6) ? (Math.round(image.size / 10000) / 100) + "MB" : (Math.round(image.size / 10) / 100) + "KB"})` : "PNG, JPG atau JPEG (Max. 8MB)"}</p>
          </div>

          <input
            autoComplete="off" id="foto" name="foto" type="file" className="hidden" accept="image/*" onChange={(e) => { e.target.files ? ((e.target.files[0].size < 8000000) ? setImage(e.target.files[0]) : (showMessage("Image is too large!", "warn", "Please put an image smaller than 8MB"))) : "" }} />
        </label>
      </div>
    </Dialog>
  </>;
}