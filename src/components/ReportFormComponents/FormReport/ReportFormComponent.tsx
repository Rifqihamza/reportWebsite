import { useEffect, useRef, useState } from "react";
import {
  addReport,
  APIResultType,
} from "../../../utils/api_interface";
import {
  max_file_size,
  ReportType,
  string_to_campus,
  string_to_reporttype,
} from "../../../types/variables";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import ReportFormDropdown from "../ReportFormDropdown/ReportFormDropdown";
import UseReportConfigHookEffect, { useReportConfigHook } from "../../../hooks/shared/useReportConfig";
import { useThanksModalHook } from "../../../hooks/shared/useThanksModal";
import { useCampusDataHook } from "../../../hooks/pages/ReportForm/useCampusData";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";
import { useNetworkConnectivityHook } from "../../../hooks/shared/useNetworkConnectivity";

export default function ReportFormComponent() {
  // Report Form State
  const [submitted_by, setSubmittedBy] = useState("");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [detailLocation, setDetailLocation] = useState("");
  const [category, setCategory] = useState(null as ReportType | string | null);
  const [reportDate, setReportDate] = useState("");
  const [image, setImage] = useState(null as File | null);

  // Other state
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const { locationOptions } = useReportConfigHook();
  const { setShowThanks } = useThanksModalHook();
  const { selectedCampus } = useCampusDataHook();
  const { showMessage } = useMessageToastHook();
  const { isConnected } = useNetworkConnectivityHook();

  const toastProgress = useRef<Toast>(null);

  const reset_form = () => {
    setSubmittedBy("");
    setMessage("");
    setCategory(null);
    setDetailLocation("");
    setLocation("");
    setReportDate("");
    setImage(null);
  };

  const handle_submit = async () => {
    if (!isConnected) {
      showMessage("Internet koneksi terputus.", "error", "Mohon coba lagi setelah terkoneksi internet");
      return;
    }

    if (!selectedCampus) {
      showMessage("Please select campus first.", "warn", "");
      window.location.reload();
      return;
    }

    if (!submitted_by || !message || !category || !location || !reportDate || !image) {
      showMessage("Please complete the form.", "warn", "");
      return;
    }


    setSubmitDisabled(true);
    toastProgress.current!.show({
      summary: "Sedang upload data...",
    });

    const verified_campus_name = string_to_campus(selectedCampus);

    const result = await addReport(
      submitted_by,
      message,
      string_to_reporttype(category)!,
      location,
      detailLocation,
      reportDate ? new Date(reportDate).toISOString() : undefined,
      image || undefined,
      verified_campus_name
    );

    if (typeof result == "object") {
      reset_form();
      setShowThanks(true);
      setTimeout(() => {
        setShowThanks(false);
      }, 3500);
    } else if (result == APIResultType.Unauthorized) {
      showMessage("Unauthroized report detected!", "error", "You've been detected using a service without proper authorization. Please login again.");
    } else {
      showMessage("There's an unexpected error occured in the server side!", "error", "Sorry for the inconvenient, please try again later.");
    }

    toastProgress.current!.clear();
    setSubmitDisabled(false);
  };

  // Get the location and PIC data
  useEffect(() => {
    if (!selectedCampus) {
      return;
    }
  }, [selectedCampus]);

  return (
    <>
      <div className="max-w-5xl mx-auto px-8">
        <UseReportConfigHookEffect />
        <p className="text-white w-full text-center mt-4">Campus: {selectedCampus}</p>
        <form id="report-form" autoComplete="off">
          {/* Container Form input */}
          <div className={submitDisabled ? " opacity-50 bg-[#ccc55] pointer-events-none" : ""}>
            {/* Detail Laporan */}
            <div className="flex flex-col w-full">
              <div className="bg-[#CB6040] px-4 py-3 w-full rounded-t-2xl translate-y-[1.5rem] -z-10">
                <label
                  htmlFor="laporan"
                  className="md:text-lg font-semibold mb-6 text-xs text-white flex flex-row gap-2 items-center"
                >
                  <i className="pi pi-file" />
                  Detail Laporan
                </label>
              </div>
              <textarea
                rows={3}
                name="laporan"
                id="laporan"
                placeholder="Deskripsikan Temuan Anda..."
                className="resize-none outline-none px-6 py-4 w-full bg-[#F2E5BF] border-2 border-white rounded-2xl focus:shadow-inner focus:shadow-gray-400 focus:duration-300 focus:ease"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                maxLength={200}
                required
              ></textarea>
            </div>
            {/* End Detail Laporan */}

            {/* Nama Pelapor */}
            <div className="flex flex-col gap-2 w-full">
              <div className="bg-[#CB6040] px-4 py-3 w-full rounded-t-2xl translate-y-[1.5rem] -z-10">
                <label
                  htmlFor="submitted_by"
                  className="md:text-lg font-semibold mb-4 text-xs text-white flex flex-row gap-2 items-center"
                >
                  <i className="pi pi-address-book" />
                  Nama Pelapor
                </label>
              </div>
              <input
                autoComplete="off"
                name="submitted_by"
                id="submitted_by"
                placeholder="Nama Pelapor..."
                className=" outline-none px-6 py-4 w-full bg-[#F2E5BF] border-2 border-white rounded-2xl focus:shadow-inner focus:shadow-gray-400 focus:duration-300 focus:ease"
                onChange={(e) => setSubmittedBy(e.target.value)}
                value={submitted_by}
                maxLength={30}
                required
              />
            </div>

            {/* Lokasi Temuan */}
            <div className="flex flex-row gap-2 w-full">
              <ReportFormDropdown
                placeholder={(selectedCampus && Object.values(locationOptions).length == 0) ? "Loading Data Lokasi.." : "Pilih Lokasi"}
                label="Kode Lokasi"
                items={selectedCampus ? locationOptions[selectedCampus] : []}
                onSelect={(value) => setLocation(value || "")}
                selected={location}
                disabled={Object.values(locationOptions).length == 0}
                icon="pi pi-map"
                filter
              />
            </div>

            {/* Detail Lokasi */}
            <div className="flex flex-col gap-2 w-full">
              <div className="bg-[#CB6040] px-4 py-3 w-full rounded-t-2xl translate-y-[1.5rem] -z-10">
                <label
                  htmlFor="detail_location"
                  className="md:text-lg font-semibold mb-4 text-xs text-white flex flex-row gap-2 items-center"
                >
                  <i className="pi pi-map-marker" />
                  Keterangan Lokasi
                </label>
              </div>
              <input
                autoComplete="off"
                name="detail_location"
                id="detail_location"
                placeholder="Tambahkan detail lokasi..."
                className=" outline-none px-6 py-4 w-full bg-[#F2E5BF] border-2 border-white rounded-2xl focus:shadow-inner focus:shadow-gray-400 focus:duration-300 focus:ease"
                onChange={(e) => setDetailLocation(e.target.value)}
                value={detailLocation}
                maxLength={200}
                required
              />
            </div>

            {/* Tanggal Temuan section */}
            <div className="flex flex-col gap-2 w-full">
              <div className="bg-[#CB6040] px-4 py-3 w-full rounded-t-2xl translate-y-[1.5rem] -z-10">
                <label
                  htmlFor="tanggal"
                  className="md:text-lg font-semibold mb-4 text-xs text-white flex flex-row gap-2 items-center"
                >
                  <i className="pi pi-calendar" />
                  Tanggal Temuan
                </label>
              </div>
              <input
                autoComplete="off"
                type="datetime-local"
                placeholder="Tanggal temuan"
                className="outline-none px-6 py-4 w-full bg-[#F2E5BF] border-2 border-white rounded-2xl focus:shadow-inner focus:shadow-gray-400 focus:duration-300 focus:ease"
                onChange={(e) => setReportDate(e.target.value)}
                value={reportDate}
                required
              />
            </div>
            {/* End Tanggal Temuan */}

            {/* Dropdowns Section */}
            <div className="flex flex-col md:flex-row gap-6">
              <ReportFormDropdown
                label="Pilih Kategori"
                placeholder="Kategori"
                items={[...Object.keys(ReportType).filter((x) => x != "NoType" && x != "VR"), "5R"]}
                onSelect={(value) => {
                  setCategory(value);
                }}
                selected={category}
                icon={"pi pi-box"}
              />
            </div>
            {/* End Dropdowns */}
          </div>
          {/* End Container Form Input */}

          {/* File Image Upload */}
          <div className={`flex flex-col gap-2 w-full ${submitDisabled ? "opacity-50 bg-[#ccc55] pointer-events-none" : ""}`}>
            <div className="bg-[#CB6040] px-4 py-3 w-full rounded-t-2xl translate-y-[1.5rem] -z-10">
              <label
                htmlFor="foto"
                className="md:text-lg font-semibold mb-4 text-xs text-white flex flex-row gap-2 items-center"
              >
                <i className="pi pi-file" />
                Foto Bukti
              </label>
            </div>
            <div className="flex items-center justify-center w-full z-10">
              <label
                htmlFor="foto"
                className="cursor-pointer outline-none px-6 py-8 w-full bg-[#F2E5BF] border-2 border-white hover:bg-neutral-50 duration-300 rounded-2xl focus:shadow-inner focus:shadow-gray-400 focus:duration-300 focus:ease"
              >
                <div className="flex flex-col items-center justify-center">
                  <i className="pi pi-cloud text-black" />
                  <p className={`mb-1 text-sm text-${image ? "black" : "black"}`} id="file-name-display">
                    {image ? image.name : "Klik untuk upload foto"}
                  </p>
                  <p className={`text-xs text-${image ? "black" : "black"}`}>{image ? `${image.type} (${(image.size.toString().length > 6) ? (Math.round(image.size / 10000) / 100) + "MB" : (Math.round(image.size / 10) / 100) + "KB"})` : `PNG, JPG atau JPEG (Max. ${max_file_size}MB)`}</p>
                </div>

                <input
                  autoComplete="off" id="foto" name="foto" type="file" className="hidden" accept="image/*" onChange={(e) => { e.target.files ? ((e.target.files[0].size < (max_file_size * 1000000)) ? setImage(e.target.files[0]) : (showMessage("Image is too large!", "warn", "Please put an image smaller than 8MB"))) : "" }} />
              </label>
            </div>
          </div>
          {/* End File Image Upload */}

          {/* Submit Button */}
          <div className="flex md:justify-end justify-center w-full md:w-auto mt-12">
            {submitDisabled ? (
              <i
                className="pi pi-spin pi-spinner"
                style={{ fontSize: "1rem", marginRight: "10px" }}
              ></i>
            ) : (
              <button
                type="button"
                className="flex justify-center items-center disabled:opacity-50 uppercase font-medium px-6 py-4 w-full rounded-2xl cursor-pointer text-white bg-[#257180] border-2 border-white hover:bg-[#CB6040] duration-300 "
                disabled={submitDisabled}
                onClick={handle_submit}
              >
                <i className="pi pi-send mr-2" />
                Kirim Laporan
              </button>
            )}
          </div>
          {/* End Submit Button */}
        </form >

        {/* Message Toast */}
        <Toast
          ref={toastProgress}
          content={({ message }) => (
            <section
              className="flex p-3 gap-3 w-full bg-[#fffa] backdrop-blur-xl shadow-2 fadeindown"
              style={{ borderRadius: "10px" }}
            >
              <i className="pi pi-cloud-upload text-primary-500 text-2xl"></i>
              <div className="flex flex-col gap-3 w-full">
                <p className="m-0 font-semibold text-base text-[#7FA1C3]">{message.summary}</p>
                <p className="m-0 text-base text-700">{message.detail}</p>
                <div className="flex flex-col gap-2">
                  <ProgressBar
                    mode="indeterminate"
                    showValue={true}
                    style={{ height: "6px" }}
                  ></ProgressBar>
                  <label className="text-right text-xs text-[#7FA1C3]">uploading...</label>
                </div>
              </div>
            </section>
          )}
        ></Toast>
        {/* End Message Toast */}
      </div>
    </>
  );
}
