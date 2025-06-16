import NavbarComponents from "../../components/ReportFormComponents/Navbar/NavbarComponent";

import { PrimeReactProvider } from "primereact/api";

import ReportForm from "./_FormReportPage";
import FooterComponent from "../../components/ReportFormComponents/Footer/FooterComponent";
import UseUserDataHookEffect from "../../hooks/shared/useUserData";
import SelectCampusOverlay from "../../components/ReportFormComponents/SelectCampus/SelectCampusOverlay";
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
