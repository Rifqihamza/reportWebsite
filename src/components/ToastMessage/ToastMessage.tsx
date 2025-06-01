import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import { useShowMessageHook } from "../../hooks/shared/useShowMessage";
import { PrimeReactProvider } from "primereact/api";

export default function ToastMessage() {
  const toastRef = useRef<Toast|null>(null);

  const { setToastRef } = useShowMessageHook();

  useEffect(() => {
    // Set the toast reference when it already rendered
    if(toastRef) setToastRef(toastRef);
    
  }, [toastRef]);
  
  return <PrimeReactProvider><Toast ref={toastRef} position="top-right" /></PrimeReactProvider>
}