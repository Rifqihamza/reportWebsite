import PieChart from "../../components/pieChart"

const mockReports = [
    { label: "5R", value: 1, type: "5R" },
    { label: "5R", value: 1, type: "Safety" },
    { label: "5R", value: 1, type: "Abnormality" },
];

const GraphicChart = () => {
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
                <PieChart reports={mockReports} />
                <div>
                    <h1 className="font-bold tracking-wide">Grafik Laporan (Kategori)</h1>
                    <p className="text-justify w-2/3">Data disamping adalah grafik laporan yang diterima di bagian laporan kategori </p>
                </div>
            </div>
        </div>
    )
}

export default GraphicChart

