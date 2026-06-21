import { create } from "zustand";

type UseSettingFormHooksType = {
  username: string;
  setUsername: (newValue: string) => void;
  password: string;
  setPassword: (newValue: string) => void;
  editKey: string | undefined;
  setEditKey: (newValue: string | undefined) => void;
};

export const useSettingFormHooks = create<UseSettingFormHooksType>((set) => ({
  username: "",
  setUsername(newValue) {
    set(() => ({
      username: newValue
    }));
  },

  password: "",
  setPassword(newValue) {
    set(() => ({
      password: newValue
    }));
  },

  editKey: "",
  setEditKey(newValue) {
    set(() => ({
      editKey: newValue
    }));
  },
}));
