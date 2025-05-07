import PieChart from "../../components/pieChart"

const mockReports = [
    { label: "5R", value: 1, type: "5R" },
    { label: "5R", value: 1, type: "Safety" },
    { label: "5R", value: 1, type: "Abnormality" },
];

const GraphicChart = () => {
    return (
        <>
            {/* Header Title */}
            <div className="flex flex-row gap-2 justify-center items-center mb-4 md:justify-normal">
                <img src="/chartPieIcon.svg" className="md:w-5 h-auto w-7 h-auto" alt="" />
                <h1 className="font-bold uppercase tracking-[2px] text-md md:text-lg text-black">Data Grafik Laporan</h1>
            </div>
            {/* End Header Title */}
            <div className="flex md:flex-row flex-col items-center md:items-start md:justify-between justify-center w-full gap-16 md:px-8 md:py-10">
                <PieChart reports={mockReports} />
                <div>
                    <h1 className="font-bold tracking-wide">Grafik Laporan (Kategori)</h1>
                    <p className="text-justify">Data disamping adalah grafik laporan yang diterima di bagian laporan kategori </p>
                </div>
            </div>
        </>
    )
}

export default GraphicChart

