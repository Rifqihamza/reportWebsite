import NavbarComponents from "../../components/ReportFormComponents/Navbar/NavbarComponent";

import { PrimeReactProvider } from "primereact/api";

import ReportFormComponent from "../../components/ReportFormComponents/FormReport/ReportFormComponent";
import FooterComponent from "../../components/ReportFormComponents/Footer/FooterComponent";
import UseUserDataHookEffect from "../../hooks/shared/useUserData";

export default function MainPage() {

  return (
    <>
      <UseUserDataHookEffect />
      <PrimeReactProvider>
        {/* Navbar */}
        <NavbarComponents />

        {/* Form */}
        <ReportFormComponent />

        {/* Footer */}
        <FooterComponent />
      </PrimeReactProvider>
    </>
  );
}
