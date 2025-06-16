import { create } from "zustand";


type useThanksModalType = {
    showThanks: boolean;
    setShowThanks: (newShowThanks: boolean) => void;
}

export const useThanksModalHook = create<useThanksModalType>((set) => {
    return {
        showThanks: true,
        setShowThanks(newShowThanks) {
            set(() => ({ showThanks: newShowThanks }));
        },
    }
})

