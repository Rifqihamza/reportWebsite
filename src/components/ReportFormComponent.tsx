import { useEffect, useState } from "react";
import Dropdown from "./dropdowns";
import { AccountType, addReport, APIResultType, getPIC, ReportType, string_to_accounttype, string_to_reporttype } from '../api/api';

export default function ReportFormComponent() {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [pic, setPic] = useState("");
  const [category, setCategory] = useState(ReportType.SOP);
  const [followUp, setFollowUp] = useState(AccountType.Siswa);
  
  const [dropdowns, setDropdowns] = useState([
    {
      id: "pic",
      label: "PIC",
      items: ["Suhaimi", "Heas Priyo", "Amalia", "Munir"],
    },
    {
      id: "kategori",
      label: "Kategori",
      items: Object.values(ReportType),
    },
    { id: "followup", label: "Follow Up", items: Object.values(AccountType) },
  ]);

  useEffect(() => {
    getPIC().then(pic_data_array => {
      if (pic_data_array && typeof pic_data_array === "object") {
        setDropdowns(dropdowns.map((value) => value.id == "pic" ? {id: value.id, items: pic_data_array.map(pic_data => pic_data.username), label: value.label} : value));
        setPic(pic_data_array[0].username);
      }
      else {
        alert("There's an error when trying to get PIC data");
      }
    });
  }, []);
  
  const handle_submit = async () => {
    const result = await addReport(message, pic, category, followUp, location);
    if(result == APIResultType.NoError) {
      alert("Successfully add the report!");
    }
    else if(result == APIResultType.Unauthorized) {
      window.location.href = "/";
    }
    else if(result == APIResultType.InternalServerError) {
      alert("There's an unexpected error occured in the server side!");
    }
  }
    
  return (
    <>
      <form id="report-form" className="mx-8 space-y-2">
        <label
          htmlFor="laporan"
          className="md:text-md text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
        >
          <img src="../../../public/detailsReportIcon.svg" className="w-5 h-5" alt="" />
          Detail Laporan
        </label>
        {/* Laporan Text Area */}
        <div className="mt-0 flex md:flex-row flex-col md:mt-2 gap-4 md:gap-8">
          <div className="w-full">
            <textarea
              rows={6}
              name="laporan"
              id="laporan"
              placeholder="Ketik deskripsi temuan disini..."
              className="p-4 outline-none rounded-xl resize-none w-full bg-red-900 placeholder-white text-white"
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          {/* Dropdowns Section */}
          <div className="flex flex-col w-full mt-2">
            {dropdowns.map((d, index) => {
              let handler = (value: string) => {

              };

              if(d.id == "pic") {
                handler = (value: string) => setPic(value);
              }
              else if(d.id == "kategori") {
                handler = (value: string) => setCategory(string_to_reporttype(value)!);
              }
              else if(d.id == "followup") {
                handler = (value: string) => setFollowUp(string_to_accounttype(value)!);
              }
              
              return (
                <Dropdown key={index} id={d.id} label={`Pilih ${d.label}`} items={d.items} action={handler} />
              );
            })}
          </div>
        </div>

        {/* Lokasi Field */}
        <div className="space-y-2">
          <label
            htmlFor="lokasi"
            className="md:text-md text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
          >
            <img src="/locationIcon.svg" className="w-5 h-5" alt="" />
            Lokasi
          </label>
          <input
            type="text"
            name="lokasi"
            id="lokasi"
            placeholder="Lokasi temuan"
            className="p-3 outline-none rounded-xl resize-none w-full bg-red-900 placeholder-white text-white"
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2 mt-4">
          <label
            htmlFor="foto"
            className="md:text-md text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center"
          >
            <img src="/uploadFileIcon.svg" className="w-5 h-5" alt="" />
            Foto Bukti
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="foto"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-red-900 border-dashed rounded-xl cursor-pointer bg-[#e7dfcaa5] hover:bg-[#d1c9b4] duration-400"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-3 text-red-900"
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
                <p className="mb-1 text-sm text-red-900" id="file-name-display">
                  Klik untuk upload foto
                </p>
                <p className="text-xs text-red-900">PNG, JPG atau JPEG (Max. 2MB)</p>
              </div>
              <input id="foto" name="foto" type="file" className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex md:justify-end justify-center w-full md:w-auto mt-6">
          <button
            type="submit"
            className="flex items-center px-6 py-3 bg-red-900 -translate-y-[10px] [box-shadow:0_10px_0_#d1c9b4] active:[box-shadow:0_5px_0_#d1c2b5] active:-translate-y-[5px] text-white rounded-xl"
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
      </form>
    </>
  );
}
