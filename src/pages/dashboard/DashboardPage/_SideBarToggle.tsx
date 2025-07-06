import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";

export default function SidebarToggle() {
  const { setShowSidebar, showSidebar } = useDashboardNavbarHook();

  return <button
      onClick={() => setShowSidebar(!showSidebar)}
      className="p-4 flex items-center gap-4 font-semibold lg:hidden"
  >
      <i className="pi pi-bars"></i>
      E-Lapor Dashboard
  </button>
}