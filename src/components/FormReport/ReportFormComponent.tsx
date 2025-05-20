import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { addReport, APIResultType } from '../../utils/api_interface';
import { AccountType, ReportType, string_to_accounttype, string_to_reporttype, type ReportData } from "../../types/variables";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import { Dropdown } from "primereact/dropdown";

export default function ReportFormComponent({ setReportData, reportData }: { setReportData: Dispatch<SetStateAction<ReportData[]>>, reportData: ReportData[] }) {
  const [submitted_by, setSubmittedBy] = useState("");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [pic, setPic] = useState("");
  const [category, setCategory] = useState(null as ReportType | string | null);
  const [followUpType, setFollowUpType] = useState(null as AccountType | string | null);
  const [followUpName, setFollowUpName] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [reportDueDate, setReportDueDate] = useState("");
  const [image, setImage] = useState(null as File | null);
  const [submitDisabled, setSubmitDisabled] = useState(false);


  const toastProgress = useRef<Toast>(null);
  const toastSuccess = useRef<Toast>(null);

  const dropdowns = [
    {
      id: "kategori",
      label: "Kategori",
      Icon: "pi pi-box",
      items: [...Object.keys(ReportType).filter(x => x != "NoType" && x != "VR"), "5R"],
    },
    {
      id: "followup",
      label: "Follow Up",
      Icon: "pi pi-file-check",
      items: Object.keys(AccountType).filter(x => x != "NoType")
    },
  ];

  const handle_submit = async () => {
    if (!submitted_by || !message || !category || !location || !reportDate) {
      alert("Please complete the form.");
      return;
    }

    setSubmittedBy("");
    setPic("");
    setFollowUpType(null);
    setMessage("");
    setCategory(null)
    setLocation("");
    setReportDate("");
    setReportDueDate("");
    setImage(null);
    
    setSubmitDisabled(true);
    toastSuccess.current!.clear();
    toastProgress.current!.show({
      summary: "Sedang upload data..."
    });

    const result = await addReport(
      submitted_by,
      message,
      string_to_reporttype(category)!,
      pic,
      string_to_accounttype(followUpType || undefined) || undefined,
      followUpName || undefined,
      location,
      reportDate ? (new Date(reportDate)).toISOString() : undefined,
      reportDueDate ? (new Date(reportDueDate)).toISOString() : undefined,
      image || undefined
    );

    if (typeof result == "object") {
      setReportData([result, ...reportData]);
      toastSuccess.current!.show({
        summary: "Data berhasil direkam!",
        severity: "success",
        life: 3000
      });
    }
    else if (result == APIResultType.Unauthorized) {
      alert("Unauthroized report detected!");
    }
    else if (result == APIResultType.InternalServerError) {
      alert("There's an unexpected error occured in the server side!");
    }
    else {
      console.log(result);
    }

    toastProgress.current!.clear();
    setSubmitDisabled(false);
  }

  return (
    <>
      <form id="report-form" className="mx-8">
        {/* Container Form input */}
        <div className={"space-y-6" + (submitDisabled ? " opacity-50 bg-[#ccc55] pointer-events-none" : "")}>
          <div className="flex lg:flex-row flex-col gap-6">
            <div className="space-y-4 w-full">

              {/* Nama Pelapor */}
              <div className="space-y-2">
                <label
                  htmlFor="submitted_by"
                  className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
                >
                  <i className="pi pi-address-book" />
                  Nama
                </label>
                <input
                  name="submitted_by"
                  id="submitted_by"
                  placeholder="Nama Pelapor..."
                  className="px-4 py-3 outline-none border-2 border-transparent focus:border-2 focus:border-[#7FA1C3] duration-300 rounded-xl w-full bg-[#E2DAD6] placeholder-black text-black"
                  onChange={(e) => setSubmittedBy(e.target.value)}
                  value={submitted_by}
                  maxLength={191}
                  required
                />
              </div>

              {/* Nama PIC */}
              <div className="space-y-2">
                <label
                  htmlFor="pic"
                  className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
                >
                  <i className="pi pi-user" />
                  PIC
                </label>
                <input
                  name="pic"
                  id="pic"
                  placeholder="Nama PIC..."
                  className="px-4 py-3 outline-none border-2 border-transparent focus:border-2 focus:border-[#7FA1C3] duration-300 rounded-xl w-full bg-[#E2DAD6] placeholder-black text-black"
                  onChange={(e) => setPic(e.target.value)}
                  value={pic}
                  maxLength={191}
                  required
                />
              </div>

              {/* Lokasi Temuan */}
              <div className="space-y-2">
                <label
                  htmlFor="lokasi"
                  className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
                >
                  <i className="pi pi-map-marker" />
                  Lokasi
                </label>
                <input
                  type="text"
                  name="lokasi"
                  id="lokasi"
                  placeholder="Lokasi temuan"
                  className="px-4 py-3 outline-none border-2 border-transparent focus:border-2 focus:border-[#7FA1C3] duration-300 rounded-xl w-full bg-[#E2DAD6] placeholder-black text-black"
                  onChange={(e) => setLocation(e.target.value)}
                  value={location}
                  maxLength={191}
                  required
                />
              </div>
            </div>

            {/* Detail Laporan */}
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="laporan"
                className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
              >
                <i className="pi pi-file" />
                Detail Laporan
              </label>
              <textarea
                rows={10}
                name="laporan"
                id="laporan"
                placeholder="Deskripsikan Temuan Anda..."
                className="px-4 py-2 outline-none border-2 border-transparent focus:border-2 focus:border-[#7FA1C3] duration-300 rounded-xl resize-none w-full bg-[#E2DAD6] placeholder-black text-black"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                maxLength={191}
                required
              ></textarea>
            </div>
          </div>
          {/* End  */}

          {/* Tanggal */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
            {/* Tanggal Temuan section */}
            <div className="flex flex-col w-full space-y-2">
              <label htmlFor="tanggal"
                className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
              >
                <i className="pi pi-calendar" />
                Tanggal Temuan
              </label>
              <input type="datetime-local"
                placeholder="Tanggal temuan"
                className="px-4 py-2 outline-none border-2 border-transparent focus:border-2 focus:border-[#7FA1C3] duration-300 rounded-xl resize-none w-full bg-[#E2DAD6] placeholder-black text-black"
                onChange={(e) => setReportDate(e.target.value)}
                value={reportDate}
                required
              />
            </div>
            {/* End Tanggal Temuan */}

            {/* Due Date Section */}
            <div className="flex flex-col w-full space-y-2">
              <label htmlFor="dueDate"
                className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
              >
                <i className="pi pi-clock" />
                Due Date</label>
              <input type="datetime-local"
                placeholder="Tenggat Waktu"
                className="px-4 py-2 outline-none border-2 border-transparent focus:border-2 focus:border-[#7FA1C3] duration-300 rounded-xl resize-none w-full bg-[#E2DAD6] placeholder-black text-black"
                onChange={(e) => setReportDueDate(e.target.value)}
                value={reportDueDate}
                required />
            </div>
            {/* End Due Date */}
          </div>
          {/* End Tanggal */}

          {/* Dropdowns Section */}
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {dropdowns.map((d, index) => {
              let selected = category;
              let setSelected = setCategory;

              if (d.id == "followup") {
                selected = followUpType;
                setSelected = setFollowUpType;
              }

              return (
                <div className="relative text-left w-full dropdown-container" key={index}>
                  <span className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center mb-3 justify-between">
                    <div className="flex flex-row items-center gap-2">
                      <i className={d.Icon}></i>
                      <h1>{d.label}</h1>
                    </div>
                    <button type="button" className="cursor-pointer hover:text-[#7FA1C3] disabled:opacity-0 disabled:pointer-events-none" disabled={selected == null} onClick={() => setSelected(null)}>Clear</button>
                  </span>
                  <Dropdown value={selected} onChange={(e) => setSelected(e.value)} options={d.items} optionLabel="name" placeholder={d.label} className="w-full rounded-xl! bg-[#E2DAD6]! *:text-gray-500!" />
                </div>
              );
            })}
          </div>
          {/* End Dropdowns */}
        </div>
        {/* End Container Form Input */}

        {/* File Image Upload */}
        <div className={"space-y-2 mt-4" + (submitDisabled ? " opacity-50 bg-[#ccc55] pointer-events-none" : "")}>
          <label
            htmlFor="foto"
            className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
          >
            <i className="pi pi-file" />
            Foto Bukti
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="foto"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#7FA1C3] border-dashed rounded-xl cursor-pointer bg-[#E2DAD6] hover:bg-[#F5EDED] duration-400"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <i className="pi pi-cloud text-[#7FA1C3]" />
                <p className={`mb-1 text-sm text-${image ? "black" : "[#7FA1C3]"}`} id="file-name-display">
                  {image ? image.name : "Klik untuk upload foto"}
                </p>
                <p className={`text-xs text-${image ? "black" : "[#7FA1C3]"}`}>{image ? `${image.type} (${(image.size.toString().length > 6) ? (Math.round(image.size / 10000) / 100) + "MB" : (Math.round(image.size / 10) / 100) + "KB"})` : "PNG, JPG atau JPEG (Max. 2MB)"}</p>
              </div>
              <input id="foto" name="foto" type="file" className="hidden" accept="image/*" onChange={(e) => { e.target.files ? setImage(e.target.files[0]) : "" }} />
            </label>
          </div>
        </div>
        {/* End File Image Upload */}

        {/* Submit Button */}
        <div className="flex md:justify-end justify-center w-full md:w-auto mt-6">
          {submitDisabled ? <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem', marginRight: '10px' }}></i> :
            <button
              type="button"
              className="w-full justify-center disabled:opacity-50 rounded-xl flex items-center px-4 py-3 text-white bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_10px_0_#E2DAD6] active:[box-shadow:0_5px_0_#E2DAD6] active:-translate-y-[5px]"
              disabled={submitDisabled}
              onClick={handle_submit}
            >
              <i className="pi pi-send mr-2" />
              Kirim Laporan
            </button>}
        </div>
        {/* End Submit Button */}
      </form>

      {/* Message Toast */}
      <Toast
        ref={toastProgress}
        content={({ message }) => (
          <section className="flex p-3 gap-3 w-full bg-[#fffa] backdrop-blur-xl shadow-2 fadeindown" style={{ borderRadius: '10px' }}>
            <i className="pi pi-cloud-upload text-primary-500 text-2xl"></i>
            <div className="flex flex-col gap-3 w-full">
              <p className="m-0 font-semibold text-base text-[#7FA1C3]">{message.summary}</p>
              <p className="m-0 text-base text-700">{message.detail}</p>
              <div className="flex flex-col gap-2">
                <ProgressBar mode="indeterminate" showValue={true} style={{ height: "6px" }}></ProgressBar>
                <label className="text-right text-xs text-[#7FA1C3]">uploading...</label>
              </div>
            </div>
          </section>
        )}
      ></Toast>
      <Toast ref={toastSuccess} />
      {/* End Message Toast */}

    </>
  );
}
