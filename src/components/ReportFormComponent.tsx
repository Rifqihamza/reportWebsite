import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import Dropdown from "./dropdowns";
import { addReport, APIResultType } from '../utils/api_interface';
import { AccountType, ReportType, string_to_accounttype, string_to_reporttype, type ReportData } from "../types/variables";

export default function ReportFormComponent({ setReportData, reportData }: { setReportData: Dispatch<SetStateAction<ReportData[]>>, reportData: ReportData[] }) {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [pic, setPic] = useState("");
  const [category, setCategory] = useState(null as ReportType | null);
  const [followUpType, setFollowUpType] = useState(null as AccountType | null);
  const [followUpName, setFollowUpName] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [reportDueDate, setReportDueDate] = useState("");
  const [image, setImage] = useState(null as File | null)
  
  const [dropdowns, setDropdowns] = useState([
    {
      id: "kategori",
      label: "Kategori",
      items: Object.keys(ReportType).filter(x => x != "NoType"),
    },
    { id: "followup", label: "Follow Up", items: Object.keys(AccountType).filter(x => x != "NoType") },
  ]);
  
  const handle_submit = async () => {
    if(!message || !pic || !category || !followUpType || !location || !reportDate || !reportDueDate || !followUpName) {
        alert("Please complete the form.");
        return;
    }

    
    const result = await addReport(message, pic, category, followUpType, followUpName, location, (new Date(reportDate)).toISOString(), (new Date(reportDueDate)).toISOString(), image || undefined);
    if(typeof result == "object") {
      alert("Successfully add the report!");

      setReportData([result, ...reportData]);
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
  }
    
  return (
    <>
      <form id="report-form" className="mx-8">
        <div className="space-y-6">
          {/* Laporan Text Area */}
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="laporan"
              className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
            >
              <img src="/detailsReporticon.svg" className="w-5 h-5" alt="" />
              Detail Laporan
            </label>
            <textarea
              rows={3}
              name="laporan"
              id="laporan"
              placeholder="Deskripsikan Temuan Anda..."
              className="px-6 py-3 outline-none border border-[#7FA1C3] rounded-[20px] resize-none w-full bg-[#E2DAD6] placeholder-black text-black placeholder:text-md"
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          {/* End */}

          {/* PIC Name Section */}
          <div>
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="laporan"
                className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
              >
                <img src="/avatarIcon.svg" className="w-5 h-5" alt="" />
                Nama PIC
              </label>
              <input
                name="laporan"
                id="laporan"
                placeholder="Nama PIC..."
                className="px-6 py-3 outline-none rounded-[20px] resize-none w-full bg-[#E2DAD6] placeholder-black text-black placeholder:text-md"
                onChange={(e) => setPic(e.target.value)}
                required
              />
            </div>
            {/* End */}

            {/* Dropdowns Section */}
            <div className="flex flex-col md:flex-row gap-2 w-full mt-8">
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
            {/* End */}

            {/* Di Follow Up Oleh Section */}
            <div className="flex flex-col w-full space-y-2">
              <label
                htmlFor="lokasi"
                className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
              >
                <img src="/locationIcon.svg" className="w-5 h-5" alt="" />
                Lokasi
              </label>
              <input
                type="text"
                name="lokasi"
                id="lokasi"
                placeholder="Lokasi temuan"
                className="px-6 py-3 outline-none rounded-[20px] resize-none w-full bg-[#E2DAD6] placeholder-black text-black placeholder:text-md"
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            {/* End */}

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
              {/* Tanggal Temuan section */}
              <div className="flex flex-col w-full space-y-2 mt-6">
                <label htmlFor="tanggal"
                  className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
                >
                  <img src="/dateTimeIcon.svg" className="w-5 h-5" alt="" />
                  Tanggal Temuan</label>
                <input type="datetime-local"
                  placeholder="Tanggal temuan"
                  className="px-6 py-3 outline-none rounded-[20px] resize-none w-full bg-[#7FA1C3] placeholder-white text-white placeholder:text-md"
                  onChange={(e) => setReportDate(e.target.value)}
                  required />
              </div>
              {/* End */}

              {/* Due Date Section */}
              <div className="flex flex-col w-full space-y-2 mt-6">
                <label htmlFor="dueDate"
                  className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
                >
                  <img src="/timeIcon.svg" className="w-5 h-5" alt="" />
                  Due Date</label>
                <input type="datetime-local"
                  placeholder="Tenggat Waktu"
                  className="px-6 py-3 outline-none rounded-[20px] resize-none w-full bg-[#7FA1C3] placeholder-white text-white placeholder:text-md"
                  onChange={(e) => setReportDueDate(e.target.value)}
                  required />
              </div>
            </div>
            <div className="flex flex-col w-full space-y-2 mt-5">
              <label
                htmlFor="lokasi"
                className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
              >
                <img src="/followUpIcon.svg" className="w-5 h-5" alt="" />
                Follow Up Oleh
              </label>
              <input
                type="text"
                name="lokasi"
                id="lokasi"
                placeholder="Nama Follow Up..."
                className="px-6 py-3 outline-none rounded-[20px] resize-none w-full bg-[#E2DAD6] placeholder-black text-black placeholder:text-md"
                onChange={(e) => setFollowUpName(e.target.value)}
                required
              />
            </div>
          </div>
        </div>


        {/* File Upload */}
        <div className="space-y-2 mt-4">
          <label
            htmlFor="foto"
            className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
          >
            <img src="/uploadFileIcon.svg" className="w-5 h-5" alt="" />
            Foto Bukti
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="foto"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#7FA1C3] border-dashed rounded-[20px] cursor-pointer bg-[#E2DAD6] hover:bg-[#F5EDED] duration-400"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-3 text-[#7FA1C3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className={`mb-1 text-sm text-[${image ? "black" : "#7FA1C3"}]`} id="file-name-display">
                  {image ? image.name : "Klik untuk upload foto"}
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
            className="rounded-[20px] flex items-center px-6 py-3 text-white bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_10px_0_#E2DAD6] active:[box-shadow:0_5px_0_#E2DAD6] active:-translate-y-[5px]"
            onClick={handle_submit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              ></path>
            </svg>
            Kirim Laporan
          </button>
        </div>
      </form >
    </>
  );
}
