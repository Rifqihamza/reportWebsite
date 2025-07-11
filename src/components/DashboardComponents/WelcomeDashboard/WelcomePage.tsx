import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import UseUserDataHookEffect, { useUserDataHook } from "../../../hooks/shared/useUserData";
import { AccountAPIPrivillage, menuItems, type MenuItem } from "../../../types/variables";

function QuickNavigationButton(props: { icon: string, title: string, description: string, onClick: () => void }) {
    return (
        <button
            className="flex-1 w-max md:h-48 cursor-pointer aspect-video flex flex-col gap-2 justify-center items-center px-2 py-4 rounded-xl bg-[#1f324d] hover:bg-slate-500 text-white duration-300"
            onClick={props.onClick}
        >
            <i className={`pi ${props.icon}`} style={{ fontSize: "28px" }}></i>
            <h1 className="text-lg">{props.title}</h1>
            <p className="hidden md:inline text-md font-thin w-48">{props.description}</p>
        </button>
    );
}

function quickNavigationMapper(item: MenuItem, setActiveTab: (newActiveTab: number) => void, userPrivillages: AccountAPIPrivillage[]): React.ReactNode {
    if(item.privillage && !userPrivillages.includes(item.privillage)) {
        return <></>;
    }

    return <QuickNavigationButton title={item.label} description={item.description} icon={item.icon} onClick={() => setActiveTab(item.id)} />   
}

export default function WelcomePage() {
    const { setActiveTab, activeTab } = useDashboardNavbarHook();
    const { userData, userPrivillages } = useUserDataHook();

    const currentHour = (new Date()).getHours();
    const greeting = (currentHour > 18 || currentHour < 5) ? "Selamat Malam" : (currentHour > 11 ? (currentHour >= 15 ? "Selamat Sore" : "Selamat Siang") : "Selamat Pagi");

            if (activeTab !== 0) {
                return <></>;
            }

    return (
        <div className="h-full w-full relative px-4 py-10 md:py-10 flex flex-col items-center justify-center text-center overflow-auto">
            <UseUserDataHookEffect adminOnly />
            <div className="w-full space-y-4">
                <div className="w-full max-w-3xl mx-auto text-center">
                    {/* Welcome message */}
                    <h1 className="text-3xl tracking-wide text-[#1f324d]">{greeting}, {userData ? <><b>{userData?.username}</b>!</> : <i className="pi pi-spinner pi-spin" style={{ fontSize: 18 }} />}</h1>
                    <p className="text-lg w-full max-w-xl mx-auto text-[#1f324d]">Selamat datang di Dashboard! Disini adalah tempat kita melihat, mengelola, dan menganalisa data laporan yang telah direkam oleh sistem</p>

                </div>
                {/* Quick Navigation */}
                <div className="w-full max-w-3xl flex flex-wrap items-center justify-center gap-3 mx-auto">
                    {menuItems.filter((value) => value.id != 0).map((item) => quickNavigationMapper(item, setActiveTab, userPrivillages))}
                </div>
            </div>
        </div>
    )
}