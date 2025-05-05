import ReportForm from "./reportForm";
import ListDataReport from "./listDataReport";

export default function MainPage() {
  
  
  return <>
    {/* Tabs */}
    <div className="flex items-center">
      <button id="tab-form" className="tab-button active" data-tab="form">Report</button>
      <button id="tab-data" className="tab-button" data-tab="data">Report Data</button>
    </div>

    {/* Content */}
    <div className="rounded-b-xl rounded-tr-xl px-4 py-6 min-h-[30rem] relative bg-white shadow-md shadow-gray-600">
      <div id="form-section" className="tab-content active">
        <ReportForm />
      </div>
      <div id="data-section" className="tab-content hidden">
        <ListDataReport />
      </div>
    </div>
  </>
}
