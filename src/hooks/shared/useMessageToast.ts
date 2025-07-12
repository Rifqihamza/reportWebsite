import type { Toast, ToastMessage } from "primereact/toast";
import type React from "react";
import { create } from "zustand";

type useMessageToastType = {
  toastRef: React.RefObject<Toast | null>|null;
  setToastRef: (newToastRef: React.RefObject<Toast | null>) => void;
  showMessage: (label: string, severity: ToastMessage["severity"], detail?: string) => void;
};

export const useMessageToastHook = create<useMessageToastType>((set) => ({
  toastRef: null,
  setToastRef(newToastRef) {
      set(() => ({toastRef: newToastRef}));
  },
  showMessage(label, severity, detail) {
    set((state) => {
      state.toastRef?.current?.show({
        summary: label,
        severity: severity,
        detail: detail
      });

      return {};
    })
  },
})) 

