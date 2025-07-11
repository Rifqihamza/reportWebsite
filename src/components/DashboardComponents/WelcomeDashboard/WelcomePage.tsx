        import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
        import { useReportDataHook } from "../../../hooks/shared/useReportData";
        import UseUserDataHookEffect, { useUserDataHook } from "../../../hooks/shared/useUserData";
        import { ReportStatus } from "../../../types/variables";

        function QuickNavigationButton(props: { icon: string, title: string, description: string, onClick: () => void }) {
            return (
                <button
                    className="cursor-pointer px-2 py-4 rounded-xl bg-[#1f324d] hover:bg-slate-500 text-white duration-300"
                    onClick={props.onClick}
                >
                    <i className={`pi ${props.icon}`} style={{ fontSize: "18px" }}></i>
                    <h1 className="text-md">{props.title}</h1>
                </button>
            );
        }

        function DataReport(props: { title: string, value: number, icon: string }) {
            return (
                <div className="w-full h-full aspect-video p-4 bg-[#1f324d] rounded-xl flex flex-col gap-2 justify-between">
                    <div className="flex flex-row items-center justify-between gap-8">
                        <h1 className="text-md font-semibold">{props.title}</h1>
                        <i className={`pi ${props.icon}`}></i>
                    </div>
                    <p className="text-4xl">{props.value} <span className="text-xl">laporan</span></p>
                </div>
            );
        }


        export default function WelcomePage() {
            const { setActiveTab, activeTab } = useDashboardNavbarHook();

            const { userData } = useUserDataHook();
            const { reportData } = useReportDataHook();

            const currentHour = (new Date()).getHours();
            const greeting =
                (currentHour > 18 || currentHour < 5) ?
                    "Selamat Malam" : (currentHour > 12 ?
                        (currentHour >= 15 ?
                            "Selamat Sore" :
                            "Selamat Siang") :
                        "Selamat Pagi");

            if (activeTab !== 0) {
                return <></>;
            }

            return (
                <section className="h-full w-full relative px-8 py-10 md:py-6 overflow-auto">
                    <UseUserDataHookEffect adminOnly />
                    <div className="text-black text-left flex flex-row justify-between items-center gap-4 w-full">
                        <div>
                            <span className="text-2xl tracking-wider font-semibold">{greeting}</span>
                            <h1 className="text-2xl">Hello, <span className="font-semibold">{userData?.username || "User"}!</span></h1>
                            <p className="text-sm tracking-wider">Welcome to the dashboard. Here you can manage your reports and settings.</p>
                        </div>

                        <div className="flex flex-row gap-4 mt-4">
                            <QuickNavigationButton icon="pi-file"
                                title="Table"
                                description="Buat laporan baru"
                                onClick={() => setActiveTab(1)}
                            />
                            <QuickNavigationButton
                                icon="pi-chart-bar"
                                title="Analytics"
                                description="Kelola pengguna sistem"
                                onClick={() => setActiveTab(2)}
                            />
                            <QuickNavigationButton
                                icon="pi-download"
                                title="Exports"
                                description="Pengaturan sistem"
                                onClick={() => setActiveTab(3)}
                            />
                            <QuickNavigationButton
                                icon="pi-user"
                                title="Users"
                                description="Lihat statistik laporan"
                                onClick={() => setActiveTab(4)}
                            />
                            <QuickNavigationButton
                                icon="pi-cog"
                                title="Settings"
                                description="Informasi tentang aplikasi"
                                onClick={() => setActiveTab(5)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full mt-4 gap-4">
                        <DataReport title="Total Laporan" value={reportData?.length || 0} icon="pi-file" />
                        <DataReport title="Complete" value={reportData?.filter(report => report.status === ReportStatus.Complete).length || 0} icon="pi-check" />
                        <DataReport title="Hold" value={reportData?.filter(report => report.status === ReportStatus.Hold).length || 0} icon="pi-refresh" />
                        <DataReport title="Process" value={reportData?.filter(report => report.status === ReportStatus.InProcess).length || 0} icon="pi-spinner" />
                        <DataReport title="Not Started" value={reportData?.filter(report => report.status === ReportStatus.NotStarted).length || 0} icon="pi-ban" />
                    </div>
                </section>
            )
        }