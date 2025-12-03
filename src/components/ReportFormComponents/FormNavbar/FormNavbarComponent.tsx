import { useFormSidebarHooks } from "../../../hooks/pages/ReportForm/useFormSidebarHooks";
import { useUserDataHook } from "../../../hooks/shared/useUserData";


export default function FormNavbarComponent() {
      const { userData, isAuthorized, isPIC } = useUserDataHook();
      const { isOpen, setIsOpen } = useFormSidebarHooks();
      
      
      return <nav  className="w-screen h-fit p-8 flex flex-row justify-between items-center pointer-events-auto bg-black backdrop-blur-lg z-105">
            <div>
                  <h1 className="text-lg">Form Laporan</h1>
                  <p className="text-sm font-thin">Tempat melaporkan temuan</p>
            </div>
            <div className="cursor-pointer *:md:text-xl!" onClick={() => setIsOpen(!isOpen)}>
                  {
                        isOpen ?
                        <i className="pi pi-times"></i>
                        :
                        <i className="pi pi-bars"></i>
                  }
            </div>
      </nav>;
}