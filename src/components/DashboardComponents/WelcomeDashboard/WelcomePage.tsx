import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import UseUserDataHookEffect, { useUserDataHook } from "../../../hooks/shared/useUserData";

function QuickNavigationButton(props: { icon: string, title: string, description: string, onClick: () => void }) {
    return (
        <button
            className="flex-1 max-w-full h-auto cursor-pointer aspect-video flex flex-col gap-2 justify-center items-center px-2 py-4 rounded-xl bg-[#1f324d] hover:bg-slate-500 text-white duration-300"
            onClick={props.onClick}
        >
            <i className={`pi ${props.icon}`} style={{ fontSize: "28px" }}></i>
            <h1 className="text-lg">{props.title}</h1>
        </button>
    );
}


export default function WelcomePage() {
    const { setActiveTab, activeTab } = useDashboardNavbarHook();

    const { userData } = useUserDataHook();

    const currentHour = (new Date()).getHours();
    const greeting = (currentHour > 18 || currentHour < 5) ? "Selamat Malam" : (currentHour > 12 ? (currentHour >= 15 ? "Selamat Sore" : "Selamat Siang") : "Selamat Pagi");

    if (activeTab !== 0) {
        return <></>;
    }

    return (
        <div className="h-full w-full relative px-4 py-10 md:py-10 flex flex-col items-center justify-center lg:-translate-y-1/5 text-center overflow-auto">
            <UseUserDataHookEffect adminOnly />
            <div className="w-full space-y-4">
                <div className="w-full max-w-3xl mx-auto text-center">
                    {/* Welcome message */}
                    <h1 className="text-3xl tracking-wide text-[#1f324d]">{greeting}, {userData ? <><b>{userData?.username}</b>!</> : <i className="pi pi-spinner pi-spin" style={{ fontSize: 18 }} />}</h1>
                    <p className="text-lg w-full max-w-xl mx-auto text-[#1f324d]">Selamat datang di Dashboard! Disini adalah tempat kita melihat, mengelola, dan menganalisa data laporan yang telah direkam oleh sistem</p>

                </div>
                {/* Quick Navigation */}
                <div className="w-full max-w-3xl flex flex-wrap items-center justify-center gap-3 mx-auto">
                    <QuickNavigationButton title="Table" description="Lihat dan kelola data laporan yang disimpan" icon="pi pi-table" onClick={() => setActiveTab(1)} />
                    <QuickNavigationButton title="Statistics" description="Lihat dan analisa data laporan berdasarkan statistik" icon="pi pi-chart-bar" onClick={() => setActiveTab(2)} />
                    <QuickNavigationButton title="Export" description="Download data yang telah terekam sistem" icon="pi pi-file-export" onClick={() => setActiveTab(3)} />
                    <QuickNavigationButton title="Users" description="Lihat data pengguna yang menggunakan website ini" icon="pi pi-user" onClick={() => setActiveTab(4)} />
                    <QuickNavigationButton title="Setting" description="Lihat data pengguna yang menggunakan website ini" icon="pi pi-cog" onClick={() => setActiveTab(4)} />
                </div>
            </div>
        </div>
    )
}