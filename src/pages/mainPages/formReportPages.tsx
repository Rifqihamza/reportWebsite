import ReportFormComponent from "../../components/FormReport/ReportFormComponent";
import ReportIcon from "@mui/icons-material/Report";

export default function ReportForm() {
  return (
    <>
      <div className="flex flex-row gap-2 justify-center items-center mb-4 md:justify-normal">
        <ReportIcon fontSize="medium" />
        <h1 className="titlePage">Laporkan Temuanmu</h1>
      </div>
      <ReportFormComponent />
    </>
  )
}
