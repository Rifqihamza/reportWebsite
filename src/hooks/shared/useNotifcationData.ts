import { create } from "zustand";

type NotificationType = {
      message: string,
      created_at: boolean,
      opened: boolean
}

type UseNotificationDataType = {
      notifications: NotificationType[] | null,
      setNotifications: (newNotifications: NotificationType[]) => void,
      addNotification: (newNotification: NotificationType) => void
};

export const useNotificationData = create<UseNotificationDataType>((set) => ({
      notifications: null,
      setNotifications(newNotifications) {
            set(() => ({
                  notifications: newNotifications
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