import { useNotificationData } from "../../../hooks/shared/useNotifcationData";
import UseNotificationDataEffect from "../../../hooks/shared/useNotificationDataEffect";


export default function FormSidebarNotification() {
      const { notifications } = useNotificationData();

      return <>
            <UseNotificationDataEffect />
            <p className="font-semibold text-xl">Notifications</p>
            <div>
                  {(() => {
                        if(notifications === null) {
                              return <>Loading..</>
                        }
                        else if(notifications.length == 0) {
                              return <>No Notifications!</>
                        }
                        else {
                              // TODO Notification Data Implementation
                              return <>Notification...</>
                        }
                  })()}
            </div>
      </>;
}