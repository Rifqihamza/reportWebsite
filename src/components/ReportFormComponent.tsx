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

export default function ReportFormComponent() {
  const dropdowns = [
    {
      id: "kategori",
      label: "Kategori",
      items: ["5R", "Safety", "SOP"],
    },
    { id: "followup", label: "Follow Up", items: ["Guru", "Siswa", "Vendor"] },
  ];

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
              <DescriptionOutlined />
              Detail Laporan
            </label>
            <textarea
              rows={3}
              name="laporan"
              id="laporan"
              placeholder="Deskripsikan Temuan Anda..."
              className="px-4 py-3 outline-none border-2 border-transparent focus:border-2 focus:border-[#7FA1C3] duration-300 rounded-xl resize-none w-full bg-[#E2DAD6] placeholder-black text-black placeholder:text-md"
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
                required
              />
            </div>

            {/* Dropdowns Section */}
            <div className="flex flex-col md:flex-row gap-2 w-full mt-8 md:space-y-4 space-y-3">
              {dropdowns.map((d, index) => (
                <Dropdown key={index} id={d.id} label={`Pilih ${d.label}`} items={d.items} />
              ))}
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
                required
              />
            </div>

            <div className="flex flex-col md:flex-row md:gap-4 gap-0 items-center justify-between w-full">
              {/* Tanggal Temuan section */}
              <div className="flex flex-col w-full space-y-2 mt-6">
                <label htmlFor="tanggal" className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center">
                  <EventNoteOutlined />
                  Tanggal Temuan
                </label>
                <input
                  type="datetime-local"
                  className="px-4 py-3 outline-none border-2 border-[#E2DAD6] rounded-xl resize-none w-full bg-[#7FA1C3] placeholder-white text-white placeholder:text-md"
                  required
                />
              </div>

              {/* Due Date Section */}
              <div className="flex flex-col w-full space-y-2 mt-6">
                <label htmlFor="dueDate" className="md:text-lg font-semibold text-xs text-gray-600 ml-2 flex flex-row gap-2 items-center">
                  <AccessTimeOutlined />
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  className="px-4 py-3 outline-none border-2 border-[#E2DAD6] rounded-xl resize-none w-full bg-[#7FA1C3] placeholder-white text-white placeholder:text-md"
                  required
                />
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
                <p className="text-xs text-[#7FA1C3]">PNG, JPG atau JPEG (Max. 2MB)</p>
              </div>
              <input id="foto" name="foto" type="file" className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex md:justify-end justify-center w-full md:w-auto mt-6">
          <button
            type="submit"
            className="rounded-xl flex items-center px-4 py-3 text-white bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_10px_0_#E2DAD6] active:[box-shadow:0_5px_0_#E2DAD6] active:-translate-y-[5px]"
          >
            <SendOutlined className="h-5 w-5 mr-2" />
            Kirim Laporan
          </button>
        </div>
      </form>
    </>
  );
}
