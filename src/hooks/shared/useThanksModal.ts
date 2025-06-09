import { create } from "zustand";


type useThanksModalType = {
    showThanks: boolean;
    setShowThanks: (newShowThanks: boolean) => void;
}

export const useThanksModalHook = create<useThanksModalType>((set) => {
    return {
        showThanks: false,
        setShowThanks(newShowThanks) {
            set(() => ({ showThanks: newShowThanks }));
        },
    }
})

