import NavbarComponents from "../../components/Navbar/NavbarComponent";

import { AccountType } from "../../types/variables";
import { getUser } from "../../utils/api_interface";
import { useEffect } from "react";

import { PrimeReactProvider } from "primereact/api";

import ReportForm from "./_FormReportPage";
import FooterComponent from "../../components/Footer/FooterComponent";
import { useUserDataHook } from "../../hooks/shared/useUserData";
import { useIsAuthorizedHook } from "../../hooks/shared/useIsAuthorized";
import SelectCampusOverlay from "../../components/SelectCampus/SelectCampusOverlay";
import { useCampusData } from "../../hooks/shared/useCampusData";

export default function MainPage() {
  const { userData, setUserData } = useUserDataHook();
  const { setIsAuthorized } = useIsAuthorizedHook();
  const { selectedCampus } = useCampusData();

  useEffect(() => {
    getUser().then(user_data => {
      if (typeof user_data === "object") {
        setUserData(user_data);
      }
    });
  }, []);

  useEffect(() => {
    setIsAuthorized(userData && (userData.role === AccountType.Guru || userData.role === AccountType.Vendor));
  }, [userData]);


  return (
    <>
      {!selectedCampus && <SelectCampusOverlay />}
      <PrimeReactProvider>
        {/* Navbar */}
        <NavbarComponents />
        <div className="max-w-5xl mx-auto px-8">
          <ReportForm />
        </div>
        <FooterComponent />
      </PrimeReactProvider>
    </>
  );
}
