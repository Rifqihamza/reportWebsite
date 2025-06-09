import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import { useMessageToastHook } from "../../hooks/shared/useMessageToast";
import { PrimeReactProvider } from "primereact/api";

export default function ToastMessage() {
  const toastRef = useRef<Toast|null>(null);

  const { setToastRef } = useMessageToastHook();

  useEffect(() => {
    // Set the toast reference when it already rendered
    if(toastRef) setToastRef(toastRef);
    
  }, [toastRef]);
  
  return <PrimeReactProvider><Toast ref={toastRef} position="top-right" /></PrimeReactProvider>
}