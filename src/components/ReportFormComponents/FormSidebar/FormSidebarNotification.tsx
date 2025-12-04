import { useState } from "react";
import { useNotificationData } from "../../../hooks/shared/useNotifcationData";
import UseNotificationDataEffect from "../../../hooks/shared/useNotificationDataEffect";
import { date_to_str } from "../../../utils/other";
import { readNotifications } from "../../../utils/api_interface";


export default function FormSidebarNotification() {
      const { notifications, setNotifications } = useNotificationData();
      const [activeNotification, setActiveNotification] = useState<number | null>(null);

      let unreadNotificationLength = notifications?.filter(notification_data => notification_data.isNew).length ?? 0;

      return <>
            <UseNotificationDataEffect />
            <div className="flex flex-row gap-2 items-center">
                  <p className="font-semibold text-xl">Notifications</p>
                  {
                        unreadNotificationLength > 0 && <p className="p-4 h-10 flex justify-center items-center text-sm border border-white aspect-square rounded-full">{unreadNotificationLength}</p>
                  }
            </div>
            <div className="h-60 max-h-full py-4">
                  {(() => {
                        if(notifications === null) {
                              return <>Loading..</>;
                        }
                        else if(notifications.length == 0) {
                              return <>No Notifications!</>;
                        }
                        else {
                              return <div className={`relative flex flex-col gap-2 h-60 ${activeNotification === null ? "overflow-y-auto snap-y snap-mandatory" : "overflow-hidden"}`}>
                                    {
                                          notifications.map((notification_data, index) => {
                                          return <div 
                                                className={`cursor-pointer min-h-1/2 max-h-1/2 [transition:all_0.3s,opacity_0s] snap-start w-full flex flex-col p-2 box-content bg-[#1a1d24] rounded-lg ${!notification_data.isNew && "brightness-50"} ${activeNotification === null ? "relative hover:min-h-2/3 hover:max-h-2/3" : (index === activeNotification) ? "absolute top-4 left-0 max-h-full min-h-full brightness-100 [transition:all_0.3s,height_0.8s,opacity_0s]" : "opacity-0 pointer-events-none" }`}
                                                onClick={
                                                      () => {
                                                            setActiveNotification(index == activeNotification ? null : index);
                                                            if(notification_data.isNew) {
                                                                  readNotifications(notification_data.id);
                                                                  setNotifications(notifications.map((notification) => notification.id != notification_data.id ? notification : { ...notification, isNew: false }))
                                                            }
                                                      }
                                                }
                                                >
                                                      <p className="text-sm opacity-50">{date_to_str(notification_data.created_at)}</p>
                                                      <p className="mt-2 text-lg font-semibold">{notification_data.title}</p>
                                                      <p className={`text-sm font-thin w-full flex-1 text-(--foreground)! ${activeNotification === null ? "truncate" : "wrap-anywhere"}`} >{notification_data.message}</p>
                                                </div>
                                          })
                                    }
                              </div>;
                        }
                  })()}
            </div>
      </>;
}