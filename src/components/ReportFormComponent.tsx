import { useRef, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  DescriptionOutlined,
  PersonOutline,
  LocationOnOutlined,
  EventNoteOutlined,
  AccessTimeOutlined,
  AssignmentTurnedInOutlined,
  UploadFileOutlined,
  SendOutlined,
  CloudUploadOutlined,
} from '@mui/icons-material';
import Dropdown from "./dropdowns";
import { addReport, APIResultType } from '../utils/api_interface';
import { AccountType, ReportType, string_to_accounttype, string_to_reporttype, type ReportData } from "../types/variables";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";

export default function ReportFormComponent({ setReportData, reportData }: { setReportData: Dispatch<SetStateAction<ReportData[]>>, reportData: ReportData[] }) {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [pic, setPic] = useState("");
  const [category, setCategory] = useState(null as ReportType | null);
  const [followUpType, setFollowUpType] = useState(null as AccountType | null);
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
      items: Object.keys(ReportType).filter(x => x != "NoType"),
    },
    { id: "followup", label: "Follow Up", items: Object.keys(AccountType).filter(x => x != "NoType") },
  ];
  
  const handle_submit = async () => {
    if(!message || !pic || !category || !followUpType || !location || !reportDate || !reportDueDate || !followUpName) {
        alert("Please complete the form.");
        return;
    }

    setSubmitDisabled(true);
    toastSuccess.current!.clear();
    toastProgress.current!.show({
        summary: "Sedang upload data..."
    });

    const result = await addReport(message, pic, category, followUpType, followUpName, location, (new Date(reportDate)).toISOString(), (new Date(reportDueDate)).toISOString(), image || undefined);
    if(typeof result == "object") {
      alert("Successfully add the report!");

      setReportData([result, ...reportData]);
      toastSuccess.current!.show({
          summary: "Data berhasil direkam!",
          severity: "success",
          life: 3000
      });
    }
    else if(result == APIResultType.Unauthorized) {
      window.location.href = "/";
    }
    else if(result == APIResultType.InternalServerError) {
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
        <div className={"space-y-6"+(submitDisabled ? " opacity-50 bg-[#ccc55] pointer-events-none" : "")}>
          {/* Laporan Text Area */}
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="laporan"
              className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
            >
              <DescriptionOutlined />
              Detail Laporan
            </label>
            <textarea
              rows={3}
              name="laporan"
              id="laporan"
              placeholder="Deskripsikan Temuan Anda..."
              className="px-4 py-3 outline-none border-2 border-transparent focus:border-2 focus:border-[#7FA1C3] duration-300 rounded-xl resize-none w-full bg-[#E2DAD6] placeholder-black text-black placeholder:text-md"
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          {/* PIC Name Section */}
          <div>
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="pic"
                className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
              >
                <PersonOutline />
                Nama PIC
              </label>
              <input
                name="pic"
                id="pic"
                placeholder="Nama PIC..."
                className="px-4 py-3 outline-none border-2 border-transparent focus:border-2 focus:border-[#7FA1C3] duration-300 rounded-xl resize-none w-full bg-[#E2DAD6] placeholder-black text-black placeholder:text-md"
                onChange={(e) => setPic(e.target.value)}
                required
              />
            </div>

            {/* Dropdowns Section */}
            <div className="flex flex-col md:flex-row gap-2 w-full mt-8 md:space-y-4 space-y-3">
            {dropdowns.map((d, index) => {
              let handler = (value: string) => {

              };

              if(d.id == "kategori") {
                handler = (value: string) => {
                    if(value == "5R") {
                        value = "VR";
                    }

                    setCategory(string_to_reporttype(value)!)
                };

                d.items = d.items.map(value => value == "VR" ? "5R" : value);
              }
              else if(d.id == "followup") {
                handler = (value: string) => setFollowUpType(string_to_accounttype(value)!);
              }
              
              return (
                <Dropdown key={index} id={d.id} label={`Pilih ${d.label}`} items={d.items} onChange={handler} />
              );
            })}
            </div>

            {/* Lokasi Section */}
            <div className="flex flex-col w-full space-y-2 md:mt-0 mt-4">
              <label
                htmlFor="lokasi"
                className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
              >
                <LocationOnOutlined />
                Lokasi
              </label>
              <input
                type="text"
                name="lokasi"
                id="lokasi"
                placeholder="Lokasi temuan"
                className="px-4 py-3 outline-none border-2 border-transparent focus:border-2 focus:border-[#7FA1C3] duration-300 rounded-xl resize-none w-full bg-[#E2DAD6] placeholder-black text-black placeholder:text-md"
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col md:flex-row md:gap-4 gap-0 items-center justify-between w-full">
              {/* Tanggal Temuan section */}
              <div className="flex flex-col w-full space-y-2 mt-6">
                <label htmlFor="tanggal"
                  className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
                >
                  <EventNoteOutlined />
                  Tanggal Temuan
                </label>
                <input type="datetime-local"
                  placeholder="Tanggal temuan"
                  className="px-4 py-3 outline-none border-2 border-[#E2DAD6] rounded-xl resize-none w-full bg-[#7FA1C3] placeholder-white text-white placeholder:text-md"
                  onChange={(e) => setReportDate(e.target.value)}
                  required 
                />
              </div>

              {/* Due Date Section */}
              <div className="flex flex-col w-full space-y-2 mt-6">
                <label htmlFor="dueDate"
                  className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
                >
                  <AccessTimeOutlined />
                  Due Date</label>
                <input type="datetime-local"
                  placeholder="Tenggat Waktu"
                  className="px-6 py-3 outline-none border-2 border-[#E2DAD6] rounded-[20px] resize-none w-full bg-[#7FA1C3] placeholder-white text-white placeholder:text-md"
                  onChange={(e) => setReportDueDate(e.target.value)}
                  required />
              </div>
            </div>

            {/* Follow Up Oleh */}
            <div className="flex flex-col w-full space-y-2 mt-5">
              <label
                htmlFor="followUpOleh"
                className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
              >
                <AssignmentTurnedInOutlined />
                Follow Up Oleh
              </label>
              <input
                type="text"
                name="followUpOleh"
                id="followUpOleh"
                placeholder="Nama Follow Up..."
                className="px-4 py-3 outline-none border-2 border-transparent focus:border-2 focus:border-[#7FA1C3] duration-300  rounded-xl resize-none w-full bg-[#E2DAD6] placeholder-black text-black placeholder:text-md"
                onChange={(e) => setFollowUpName(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className={"space-y-2 mt-4"+(submitDisabled ? " opacity-50 bg-[#ccc55] pointer-events-none" : "")}>
          <label
            htmlFor="foto"
            className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
          >
            <UploadFileOutlined />
            Foto Bukti
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="foto"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#7FA1C3] border-dashed rounded-xl cursor-pointer bg-[#E2DAD6] hover:bg-[#F5EDED] duration-400"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudUploadOutlined className="w-8 h-8 mb-3" />
                <p className="mb-1 text-sm text-[#7FA1C3]" id="file-name-display">
                  Klik untuk upload foto
                </p>
                <p className={`text-xs text-${image ? "black" : "[#7FA1C3]"}`}>{image ? `${image.type} (${(image.size.toString().length > 6) ? (Math.round(image.size / 10000) / 100)+"MB" : (Math.round(image.size / 10) / 100)+"KB"})` : "PNG, JPG atau JPEG (Max. 2MB)"}</p>
              </div>
              <input id="foto" name="foto" type="file" className="hidden" accept="image/*" onChange={(e) => {e.target.files ? setImage(e.target.files[0]) : ""}} />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex md:justify-end justify-center w-full md:w-auto mt-6">
          <button
            type="button"
            className="disabled:opacity-50 rounded-xl flex items-center px-4 py-3 text-white bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_10px_0_#E2DAD6] active:[box-shadow:0_5px_0_#E2DAD6] active:-translate-y-[5px]"
            disabled={submitDisabled}
            onClick={handle_submit}
          >
            {submitDisabled ? <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem', marginRight: '10px' }}></i> : <SendOutlined className="h-5 w-5 mr-2" />}
            Kirim Laporan
          </button>
        </div>
      </form>
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
    </>
  );
}
