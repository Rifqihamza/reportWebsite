import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";

export default function SidebarToggle() {
  const { showSidebar } = useDashboardNavbarHook();

  return <button
      onClick={() => (!showSidebar)}
      className="p-4 flex items-center gap-4 font-semibold lg:hidden"
  >
      <i className="pi pi-bars"></i>
      E-Lapor Dashboard
  </button>
}