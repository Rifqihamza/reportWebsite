import { useEffect } from "react";
import { getNotifications } from "../../utils/api_interface";
import { useNotificationData } from "./useNotifcationData";
import { useMessageToastHook } from "./useMessageToast";

let initialized = false;

export default function UseNotificationDataEffect() {
      const { setNotifications } = useNotificationData();
      const { showMessageByAPI } = useMessageToastHook();
      
      const updateNotifications = async () => {
            const result = await getNotifications();
            if(typeof result === "object" && Array.isArray(result)) {
                  setNotifications(result);
            }
            else {
                  showMessageByAPI(result);
            }
      }
      
      useEffect(() => {
            if(initialized) return;
            
            updateNotifications();

            initialized = true;
      }, []);
      
      return <></>;
}