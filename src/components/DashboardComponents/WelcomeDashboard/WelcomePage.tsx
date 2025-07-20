import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import UseReportDataHookEffect, { useReportDataHook } from "../../../hooks/shared/useReportData";
import UseUserDataHookEffect, { useUserDataHook } from "../../../hooks/shared/useUserData";
import { ReportStatus, statusColorHex } from "../../../types/variables";
import { useEffect } from "react";

function QuickNavigationButton(props: { icon: string, title: string, description: string, onClick: () => void }) {
    return (
        <button
            className="flex-1 w-full h-40 md:w-max md:h-48 cursor-pointer aspect-video flex flex-col gap-2 justify-center items-center px-2 py-4 rounded-xl bg-[#1f324d] hover:bg-slate-500 text-white duration-300"
            onClick={props.onClick}
        >
            <i className={`pi ${props.icon}`} style={{ fontSize: "18px" }}></i>
            <h1 className="md:text-sm text-[8px]">{props.title}</h1>
        </button>
    );
}

function DataReport(props: { title: string; value: number; icon: string; status: string }) {
    const bgColor = statusColorHex[props.status] || "#CB6040";

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
                {typeof props.value === "number" && !isNaN(props.value) ? (
                    props.value
                ) : (
                    <i className="pi pi-spinner pi-spin" style={{ fontSize: 18 }} />
                )}{" "}
                <span className="text-lg">Laporan</span>
            </p>
        </div>
    );
}



export default function WelcomePage() {
    const { setActiveTab, activeTab } = useDashboardNavbarHook();
    const { userData } = useUserDataHook();
    const { reportData } = useReportDataHook()
    UseReportDataHookEffect()

    const currentHour = new Date().getHours();
    const greeting =
        currentHour > 18 || currentHour < 5
            ? "Selamat Malam 🌙"
            : currentHour > 12
                ? currentHour >= 15
                    ? "Selamat Sore 🌤️"
                    : "Selamat Siang ☀️"
                : "Selamat Pagi 🌞";

    if (activeTab !== 0) return null;
    const getCount = (status: ReportStatus | "Total") => {
        if (!reportData) return 0;
        if (status === "Total") return reportData.length;
        return reportData.filter((r) => r.status === status).length;
    };
    return (
        <div className="h-full w-full relative px-4 py-5 md:py-10 flex flex-col items-center justify-center text-center overflow-auto">
            <UseUserDataHookEffect adminOnly />
            <div className="w-full space-y-4 h-full">
                <div className="w-full max-w-3xl mx-auto text-center">
                    {/* Welcome message */}
                    <h1 className="text-3xl tracking-wide text-[#1f324d]">{greeting}, {userData ? <><b>{userData?.username}</b>!</> : <i className="pi pi-spinner pi-spin" style={{ fontSize: 18 }} />}</h1>
                    <p className="text-lg w-full max-w-xl mx-auto text-[#1f324d]">Selamat datang di Dashboard! Disini adalah tempat kita melihat, mengelola, dan menganalisa data laporan yang telah direkam oleh sistem</p>
                </div>
                {/* Quick Navigation */}
                <div className="w-full h-max max-w-3xl grid grid-cols-2 grid-rows-3 md:flex md:flex-wrap md:items-center md:justify-center gap-3 mx-auto">
                    {menuItems.filter((value, index) => index !== 0).map((item) => quickNavigationMapper(item, setActiveTab, userPrivillages))}
                </div>
            </div>

            {/* Report Summary */}
            <div className="text-white flex flex-col md:flex-row gap-4">
                <DataReport status="Default" title="Total" icon="pi-file" value={getCount("Total")} />
                <DataReport status="Complete" title="Complete" icon="pi-check-circle" value={getCount(ReportStatus.Complete)} />
                <DataReport status="Hold" title="Hold" icon="pi-refresh" value={getCount(ReportStatus.Hold)} />
                <DataReport status="InProcess" title="Process" icon="pi-spinner" value={getCount(ReportStatus.InProcess)} />
                <DataReport status="NotStarted" title="Not Started" icon="pi-ban" value={getCount(ReportStatus.NotStarted)} />
            </div>
        </section>
    );
}
