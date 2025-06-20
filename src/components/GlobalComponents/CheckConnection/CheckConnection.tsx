import { useEffect } from "react";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";
import { useNetworkConnectivityHook } from "../../../hooks/shared/useNetworkConnectivity";

export default function CheckConnection() {
  const { showMessage } = useMessageToastHook();
  const { setIsConnected } = useNetworkConnectivityHook();
  
  const handleOnline = (event: Event) => {
    showMessage("Connected!", "success", "Kamu baru saja terkoneksi dengan internet!");
    setIsConnected(true);
  }
  
  const handleOffline = (event: Event) => {
    showMessage("Disconnected!", "error", "Kamu tidak terkoneksi dengan internet!");
    setIsConnected(false);
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