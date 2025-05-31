import { create } from "zustand";

type useIsAuthorizedType = {
  isAuthorized: boolean | null,
  setIsAuthorized: (newIsAuthorized: boolean | null) => void
}

export const useIsAuthorized = create<useIsAuthorizedType>((set) => ({
  isAuthorized: false,
  setIsAuthorized: (newIsAuthorized) => (set(() => ({ isAuthorized: newIsAuthorized })))
}))

