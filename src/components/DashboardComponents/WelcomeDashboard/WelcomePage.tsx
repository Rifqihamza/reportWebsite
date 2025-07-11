import { useReportPaginationHook } from "../../../hooks/pages/ReportTable/useReportHook";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import { useReportDataHook } from "../../../hooks/shared/useReportData";
import UseUserDataHookEffect, { useUserDataHook } from "../../../hooks/shared/useUserData";
import { ReportStatus, statusColorHex } from "../../../types/variables";

function QuickNavigationButton(props: { icon: string, title: string, description: string, onClick: () => void }) {
    return (
        <button
            className="cursor-pointer w-fit md:h-18 h-13 aspect-square p-2 rounded-xl bg-[#CB6040] hover:bg-[#FD8B51] text-white font-semibold duration-300"
            onClick={props.onClick}
        >
            <i className={`pi ${props.icon}`} style={{ fontSize: "18px" }}></i>
            <h1 className="md:text-sm text-[8px]">{props.title}</h1>
        </button>
    );
}

function DataReport(props: { title: string; value: number; icon: string; status: string }) {
    const bgColor = statusColorHex[props.status] || "#CB6040";  // fallback ke warna default

    return (
        <div
            className="w-full md:w-1/2 h-fit p-4 rounded-xl flex flex-col gap-2 shadow-md shadow-gray-400 text-white"
            style={{ backgroundColor: bgColor }}
        >
            <div className="flex flex-row items-center justify-between gap-8">
                <h1 className="text-sm font-semibold whitespace-nowrap md:whitespace-normal">{props.title}</h1>
                <i className={`pi ${props.icon}`}></i>
            </div>
            <p className="text-2xl md:text-4xl whitespace-nowrap md:whitespace-normal">
                {props.value} <span className="text-lg">Laporan</span>
            </p>
        </div>
    );
}



export default function WelcomePage() {
    const { setActiveTab, activeTab } = useDashboardNavbarHook();
    const { userData } = useUserDataHook();
    const { reportData } = useReportDataHook();

    const currentHour = new Date().getHours();
    const greeting =
        currentHour > 18 || currentHour < 5
            ? "Selamat Malam"
            : currentHour > 12
                ? currentHour >= 15
                    ? "Selamat Sore"
                    : "Selamat Siang"
                : "Selamat Pagi";

    if (activeTab !== 0) return null;

    return (
        <section className="px-5 py-10 md:py-6 overflow-auto space-y-4">
            <UseUserDataHookEffect adminOnly />

            {/* Header */}
            <div className="w-full h-fit bg-[#257180] shadow-md shadow-gray-400 flex flex-col md:flex-row items-center justify-between gap-4 px-3 md:px-6 py-4 rounded-xl">
                <header>
                    <div className="text-white">
                        <h1 className="text-md">{greeting}, <span className="font-semibold">{userData?.username || "User"}!</span></h1>
                        <p className="text-2xl font-medium">Welcome to the dashboard.</p>
                        <p className="text-sm">Dashboard untuk manage dan analisis laporan.</p>
                    </div>
                </header>

                {/* Quick Nav */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-white text-sm pr-2 flex gap-1 md:justify-end justify-center items-center">
                        <i className="pi pi-arrow-down" style={{ fontSize: "12px" }}></i>
                        Quick Navigation
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-4">
                        <QuickNavigationButton icon="pi-file" title="Table" description="Buat laporan baru" onClick={() => setActiveTab(1)} />
                        <QuickNavigationButton icon="pi-chart-bar" title="Analytics" description="Kelola pengguna sistem" onClick={() => setActiveTab(2)} />
                        <QuickNavigationButton icon="pi-download" title="Exports" description="Pengaturan sistem" onClick={() => setActiveTab(3)} />
                        <QuickNavigationButton icon="pi-user" title="Users" description="Lihat statistik laporan" onClick={() => setActiveTab(4)} />
                        <QuickNavigationButton icon="pi-cog" title="Settings" description="Informasi tentang aplikasi" onClick={() => setActiveTab(5)} />
                    </div>
                </div>
            </div>

            {/* Report Summary */}
            <div className="text-white flex flex-col md:flex-row gap-4">
                <DataReport status="Default" title="Total" value={reportData?.length || 0} icon="pi-file" />
                <DataReport status="Complete" title="Complete" value={reportData?.filter(r => r.status === ReportStatus.Complete).length || 0} icon="pi-check-circle" />
                <DataReport status="Hold" title="Hold" value={reportData?.filter(r => r.status === ReportStatus.Hold).length || 0} icon="pi-refresh" />
                <DataReport status="InProcess" title="Process" value={reportData?.filter(r => r.status === ReportStatus.InProcess).length || 0} icon="pi-spinner" />
                <DataReport status="NotStarted" title="Not Started" value={reportData?.filter(r => r.status === ReportStatus.NotStarted).length || 0} icon="pi-ban" />
            </div>
        </section>
    );
}
