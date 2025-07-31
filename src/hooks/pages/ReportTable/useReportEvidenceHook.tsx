import { create } from "zustand";

type useReportEvidenceType = {
    reportImageURL: string | null,
    setReportImageURL: (newReportImageURL: string | null) => void
};

export const useReportEvidenceHook = create<useReportEvidenceType>((set) => {
    return {
        reportImageURL: null,
        setReportImageURL: (newReportId) => set(() => ({ reportImageURL: newReportId })),
    }
})