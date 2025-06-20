import { useEffect } from "react";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";

export default function CheckConnection() {
  const { showMessage } = useMessageToastHook();
  
  const handleOnline = (event: Event) => {
    showMessage("Connected!", "success", "Kamu baru saja terkoneksi dengan internet!");
  }
  
  const handleOffline = (event: Event) => {
    showMessage("Disconnected!", "error", "Kamu tidak terkoneksi dengan internet!");
  }
  
  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return (() => {
      window.removeEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    })
  }, []);
  
  return <></>;
}