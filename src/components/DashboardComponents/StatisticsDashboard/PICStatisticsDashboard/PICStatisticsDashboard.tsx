import { PrimeReactProvider } from "primereact/api";
import { useDashboardNavbarHook } from "../../../../hooks/shared/useDashboardNavbar";

export default function PICStatisticsDashboard() {
  const { activeTab } = useDashboardNavbarHook();

  if(activeTab !== 6) {
      return <></>;
  }

  return <>
  </>;
}