import NavbarComponents from "../../components/Navbar/NavbarComponent";

import { PrimeReactProvider } from "primereact/api";

import ReportForm from "./_FormReportPage";
import FooterComponent from "../../components/Footer/FooterComponent";
import UseUserDataHookEffect from "../../hooks/shared/useUserData";
import SelectCampusOverlay from "../../components/SelectCampus/SelectCampusOverlay";
import { useCampusDataHook } from "../../hooks/shared/useCampusData";

export default function MainPage() {
  const { selectedCampus } = useCampusDataHook();

  return (
    <>
      <UseUserDataHookEffect />
      {!selectedCampus && <SelectCampusOverlay />}
      <PrimeReactProvider>
        {/* Navbar */}
        <NavbarComponents />

        {/* Form */}
        <ReportForm />

        {/* Footer */}
        <FooterComponent />
      </PrimeReactProvider>
    </>
  );
}
