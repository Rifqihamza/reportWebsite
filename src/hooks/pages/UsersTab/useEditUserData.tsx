import { create } from "zustand";
import type { AccountType } from "../../../types/variables";

type editedUserDataType = {
  id: string;
  username: string;
  password: string;
  role: AccountType;
  mode: "edit"
}

type newUserDataType = {
  username: string;
  password: string;
  role: AccountType | null;
  mode: "new"
}

type useEditUserDataType = {
  visibleDialog: boolean,
  setVisibleDialog: (newState: boolean) => void
  changingUserData: editedUserDataType | newUserDataType | null,
  setChangingUserData: (newValue: editedUserDataType | newUserDataType | null) => void
}

export const useEditUserDataHook = create<useEditUserDataType>((set) => {
  return {
    visibleDialog: false,
    setVisibleDialog(newState) {
      set(() => ({ visibleDialog: newState }));
    },

    changingUserData: null,
    setChangingUserData(newValue) {
      set(() => ({ changingUserData: newValue }));
    },
  }
})