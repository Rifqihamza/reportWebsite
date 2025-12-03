import { useEffect } from "react";

let initialized = false;

export default function UseNotificationDataEffect() {
      useEffect(() => {
            if(initialized) return;
            
            // Get the notification

            initialized = true;
      }, []);
      
      return <></>;
}