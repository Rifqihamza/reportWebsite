import ReportFormComponent from "../../components/ReportFormComponent";

export default function ReportForm() {

  return <>
    <div>
      <div className="flex flex-row justify-between items-center mb-2 px-4">
        <h1 className="flex flex-row gap-2 items-center font-bold uppercase tracking-[2px] text-xs md:text-lg text-black">
          <img src="/reportIcon.svg" className="w-6 h-6" alt="" />
          Laporkan Temuanmu!
        </h1>
        <img
          src="/logoSekolah.png"
          alt="Logo SMK Mitra Industri MM2100"
          className="h-12 w-auto"
        />
      </div>
      <ReportFormComponent />  
    </div>
  </>;
}
