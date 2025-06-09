import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Campus } from "../../types/variables";


type UseCampusDataType = {
  selectedCampus: Campus|null,
  setSelectedCampus: (newSelectedCampus: Campus|null) => void
}

export const useCampusData = create(
  persist<UseCampusDataType>(
    (set) => ({
      selectedCampus: null,
      setSelectedCampus(newSelectedCampus) {
        set(() => ({ selectedCampus: newSelectedCampus }));
      },
    }),{
      name: 'campus-data',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

  