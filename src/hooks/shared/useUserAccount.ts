// src/hooks/shared/useUserAccount.ts
import type { User } from "../../types/variables";
import { create } from "zustand";

type UserAccountData = {
    showUserAccountData: User[];
    setShowUserAccountData: (users: User[]) => void;
};

export const useUserAccount = create<UserAccountData>((set) => ({
    showUserAccountData: [],
    setShowUserAccountData: (users) => set({ showUserAccountData: users }),
}));
