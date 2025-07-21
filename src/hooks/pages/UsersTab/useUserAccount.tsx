// src/hooks/shared/useUserAccount.ts
import { useEffect } from "react";
import type { User } from "../../../types/variables";
import { create } from "zustand";
import { useNetworkConnectivityHook } from "../../shared/useNetworkConnectivity";
import { APIResultType, getAllUsers } from "../../../utils/api_interface";
import { useMessageToastHook } from "../../shared/useMessageToast";

type UserAccountData = {
    showedUserAccountData: User[];
    setShowedUserAccountData: (users: User[]) => void;

    userAccountData: User[],
    setUserAccountData: (users: User[]) => void

    doneFetching: boolean,
    setDoneFetching: (newState: boolean) => void,

    isAuthorized: boolean,
    setIsAuthorized: (newState: boolean) => void,

    usernameFilter: string,
    setUsernameFilter: (newUsernameFilter: string) => void
};

let initialized = false;

export const useUserAccountHook = create<UserAccountData>((set) => ({
    showedUserAccountData: [],
    setShowedUserAccountData: (users) => set({ showedUserAccountData: users }),
    
    userAccountData: [],
    setUserAccountData: (users) => set({ userAccountData: users }),

    doneFetching: false,
    setDoneFetching: (newState) => set(() => ({ doneFetching: newState })),

    isAuthorized: true,
    setIsAuthorized: (newState) => set(() => ({ isAuthorized: newState })),
    
    usernameFilter: "",
    setUsernameFilter(newUsernameFilter) {
      set(() => ({ usernameFilter: newUsernameFilter }))
    },
}));

export default function UseUserAccountHookEffect() {
    const { isConnected } = useNetworkConnectivityHook();
    const { setUserAccountData, userAccountData, setShowedUserAccountData, setDoneFetching, usernameFilter, setIsAuthorized } = useUserAccountHook();
    const { showMessage, showMessageByAPI } = useMessageToastHook();
    
    useEffect(() => {
        if(initialized || !isConnected) {
            return;
        }
        initialized = true;
        
        getAllUsers().then((result) => {
            if (Array.isArray(result)) {
                setUserAccountData(result);
            } else if (result === false) {
                showMessage("Terjadi kesalahan.", "error");
            } else if (result === APIResultType.Unauthorized) {
                setIsAuthorized(false);
            } else {
                showMessageByAPI(result);
            }
        }).catch(() => {
            showMessage("Terjadi kesalahan.", "error", "Mohon coba beberapa saat lagi.");
        }).finally(() => {
            setDoneFetching(true);
        });
    }, [isConnected]);

    useEffect(() => {
        setShowedUserAccountData(userAccountData.filter((user) => user.username.toLowerCase().includes(usernameFilter)));
    }, [usernameFilter, userAccountData]);

    return <></>;
}