import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import { useShowMessage } from "../../hooks/shared/useShowMessage";

export default function ToastMessage() {
  const toastRef = useRef<Toast|null>(null);

  const { setToastRef } = useShowMessage();

  useEffect(() => {
    // Set the toast reference when it already rendered
    if(toastRef) setToastRef(toastRef);
    
  }, [toastRef]);
  
  return <Toast ref={toastRef} position="top-right" />
}