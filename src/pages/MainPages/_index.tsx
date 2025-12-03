import { PrimeReactProvider } from "primereact/api";

import ReportFormComponent from "../../components/ReportFormComponents/FormReport/ReportFormComponent";
import FooterComponent from "../../components/ReportFormComponents/FormFooter/FooterComponent";
import UseUserDataHookEffect from "../../hooks/shared/useUserData";

export default function MainPage() {

  return (
    <>
      <UseUserDataHookEffect />
      <PrimeReactProvider>
        <div className="h-24"></div>

        {/* Form */}
        <ReportFormComponent />

        {/* Footer */}
        <FooterComponent />
      </PrimeReactProvider>
    </>
  );
}
