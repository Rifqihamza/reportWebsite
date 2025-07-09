import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import UseUserDataHookEffect, { useUserDataHook } from "../../../hooks/shared/useUserData";

function QuickNavigationButton(props: { icon: string, title: string, description: string, onClick: () => void }) {
    return <button className="cursor-pointer w-full h-auto aspect-square flex flex-col gap-2 justify-center items-center px-2 py-4 rounded-xl bg-[#1f324d] hover:bg-slate-500 text-white duration-300" onClick={props.onClick}>
        <i className={`pi ${props.icon}`} style={{ fontSize: "28px" }}></i>
        <h1 className="text-lg">{props.title}</h1>
    </button>;
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
        <div className="h-full w-full bg-white rounded-2xl relative px-4 py-10 md:py-10 flex flex-col text-center overflow-auto">
            <UseUserDataHookEffect adminOnly />
            <div className="w-full space-y-4">
                {/* Welcome message */}
                <h1 className="text-3xl tracking-wide text-[#1f324d]">{greeting}, {userData ? <><b>{userData?.username}</b>!</> : <i className="pi pi-spinner pi-spin" style={{ fontSize: 18 }} />}</h1>
                <p className="text-lg w-full max-w-xl mx-auto">Selamat datang di Dashboard! Disini adalah tempat kita melihat, mengelola, dan menganalisa data laporan yang telah direkam oleh sistem</p>

                {/* Quick Navigation */}
                <div className="w-full max-w-3xl grid sm:grid-cols-5 grid-cols-1 mx-auto gap-4 justify-items-center">
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