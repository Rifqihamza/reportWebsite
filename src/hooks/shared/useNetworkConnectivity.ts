import { create } from "zustand";

type UseNetworkConnectivityType = {
  isConnected: boolean,
  setIsConnected: (newIsConnected: boolean) => void
};

export const useNetworkConnectivityHook = create<UseNetworkConnectivityType>((set) => {
  return {
    isConnected: true,
    setIsConnected(newIsConnected) {
      set(() => ({ isConnected: newIsConnected }))
    },
  }
})

