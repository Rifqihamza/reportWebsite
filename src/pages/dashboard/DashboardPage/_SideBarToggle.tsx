import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";

export default function SidebarToggle() {
  const { setShowSidebar, showSidebar } = useDashboardNavbarHook();

  return <button
    onClick={() => setShowSidebar(!showSidebar)}
    className="w-full py-2 flex items-center justify-between gap-4 font-semibold lg:hidden text-white"
  >
    <h1 className="text-white">
      E-Lapor Dashboard
    </h1>
    {
      showSidebar
        ? <i className="pi pi-times"></i>
        : <i className="pi pi-bars"></i>
    }
  </button>
}