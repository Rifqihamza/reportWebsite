import ReportFormComponent from "../../components/ReportFormComponent";

export default function ReportForm() {

  return (
    <>
      {/* Header Title */}
      <div className="flex flex-row gap-2 justify-center items-center mb-4 md:justify-normal">
        <img src="/reportIcon.svg" className="w-7 h-auto md:w-6 md:h-auto" alt="" />
        <h1 className="font-bold uppercase tracking-[2px] text-md md:text-lg text-black">Laporkan Temuanmu</h1>
      </div>
      {/* End Header Title */}
      <ReportFormComponent />
    </>
  )
}
