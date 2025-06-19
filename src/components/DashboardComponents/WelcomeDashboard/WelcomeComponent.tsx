import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import { useUserDataHook } from "../../../hooks/shared/useUserData";

function QuickNavigationButton(props: { icon: string, title: string, description: string, onClick: () => void }) {
    return <button className="flex flex-col p-4 gap-4 justify-center items-center bg-gray-100 w-full *:text-[#1f324d] border-[#1f324d] border-2 rounded-2xl cursor-pointer duration-200 hover:bg-gray-200" onClick={props.onClick}>
            <h1 className="text-3xl">{props.title}</h1>
            <i className={`pi ${props.icon}`} style={{ fontSize: "48px" }}></i>
        <p>{props.description}</p>
    </button>;
}

export default function WelcomeComponent() {
    const { userData } = useUserDataHook();
    const { setActiveTab } = useDashboardNavbarHook();

    const currentHour = (new Date()).getHours();
    const greeting = (currentHour > 18 || currentHour < 5) ? "Selamat Malam" : (currentHour > 12 ? "Selamat Siang" : "Selamat Pagi");

    return (
        <div className="h-fit md:h-full w-full bg-white rounded-2xl relative px-4 py-10 md:py-20 flex flex-col text-center">
            {/* Welcome message */}
            <h1 className="text-3xl tracking-wide text-[#1f324d]">{greeting}, <b>{userData?.username}</b>!</h1>
            <p>Selamat datang di <b>Dashboard Admin</b>! Disini adalah tempat kita melihat, mengelola, dan menganalisa data laporan yang telah direkam oleh sistem</p>

            {/* Quick Navigation */}
            <div className="w-full h-fit p-4 mt-4 grid md:grid-cols-2 grid-cols-1 gap-4">
                <QuickNavigationButton title="Report Table" description="Lihat dan kelola data laporan yang disimpan" icon="pi-table" onClick={() => setActiveTab(1)} />
                <QuickNavigationButton title="Report Statistics" description="Lihat dan analisa data laporan berdasarkan statistik" icon="pi-chart-line" onClick={() => setActiveTab(2)} />
                <QuickNavigationButton title="Export Data" description="Export data berdasarkan statistik" icon="pi-file-export" onClick={() => setActiveTab(3)} />
                <QuickNavigationButton title="Configuration" description="Lihat data atau edit data pengguna" icon="pi-file-edit" onClick={() => setActiveTab(4)} />
            </div>
        </div>
    )
}