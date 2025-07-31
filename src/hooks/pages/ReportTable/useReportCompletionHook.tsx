import { create } from "zustand";

type useReportCompletionType = {
    reportId: string | null;
    setReportId: (newReportId: string | null) => void
};

export const useReportCompletionHook = create<useReportCompletionType>((set) => {
    return {
        reportId: null,
        setReportId(newReportId) {
            set(() => ({ reportId: newReportId }))
        },
    }
})