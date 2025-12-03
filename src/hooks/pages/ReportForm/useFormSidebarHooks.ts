import { create } from "zustand";

type UseFormSidebarHookType = {
      isOpen: boolean,
      setIsOpen: (newState: boolean) => void
}

export const useFormSidebarHooks = create<UseFormSidebarHookType>((set) => ({
      isOpen: false,
      setIsOpen(newState) {
            set(() => ({
                  isOpen: newState
            }));
      },
}));