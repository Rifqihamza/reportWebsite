import { create } from "zustand";
import type { Notification } from "../../types/variables";

type UseNotificationDataType = {
      notifications: Notification[] | null,
      setNotifications: (newNotifications: Notification[]) => void,
      addNotification: (newNotification: Notification) => void
};

export const useNotificationData = create<UseNotificationDataType>((set) => ({
      notifications: null,
      setNotifications(newNotifications) {
            set(() => ({
                  notifications: newNotifications.sort((a, b) => b.created_at.valueOf() - a.created_at.valueOf()).reverse()
            }));
      },
      addNotification(newNotification) {
            set((state) => {
                  if(state.notifications) {
                        return {
                              notifications: [...state.notifications, newNotification]
                        };
                  }

                  return {
                        notifications: [newNotification]
                  };
            });
      },
}))