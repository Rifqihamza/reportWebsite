import { create } from "zustand";
import type { User } from "../../types/variables";


type useUserDataType = {
  userData: User | null,
  setUserData: (data: User) => void
}

export const useUserData = create<useUserDataType>((set) => ({
  userData: null,
  setUserData: (data: User) => set(() => ({ userData: data }))
}));

