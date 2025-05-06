import { useEffect, useState } from "react";
import PieChart from "../../components/pieChart"
import { getReport } from "../../utils/api_interface";



const GraphicChart = () => {
    const [reports, setReports] = useState([
        { label: "5R", value: 1, type: "5R" },
        { label: "5R", value: 1, type: "Safety" },
        { label: "5R", value: 1, type: "Abnormality" },
    ]);
    
    useEffect(() => {
        getReport().then(report_data => {
            if(typeof report_data == "object") {
                let result_report:{ label: string, value: number, type: string }[] = [];

                report_data.forEach(report => {
                    let type = report.type.toString();

                    if(type == "VR") type = "5R";

                    const result_index = result_report.findIndex(result_value => result_value.type == type);
                    
                    if(result_index >= 0) {
                        result_report[result_index].value += 1;
                    }
                    else {
                        result_report.push({
                            label: type,
                            type: type,
                            value: 1
                        });
                    }
                });
                
                setReports(result_report);
            }
        });
    }, []);
    
    return (
        <div>
            <div className="flex flex-row justify-between items-center mb-2 px-4">
                <h1 className="flex flex-row gap-2 items-center font-bold uppercase tracking-[2px] text-xs md:text-lg text-black">
                    <img src="/chartPieIcon.svg" className="w-5 h-5" alt="" />
                    Grafik Laporan
                </h1>
                <img
                    src="/logoSekolah.png"
                    alt="Logo SMK Mitra Industri MM2100"
                    className="h-12 w-auto"
                />
            </div>
            <div className="flex flex-row justify-between w-full gap-16 px-8 py-10">
                <PieChart reports={reports} />
                <div>
                    <h1 className="font-bold tracking-wide">Grafik Laporan (Kategori)</h1>
                    <p className="text-justify w-2/3">Data disamping adalah grafik laporan yang diterima di bagian laporan kategori </p>
                </div>
            </div>
        </div>
    )
}

export default GraphicChart

