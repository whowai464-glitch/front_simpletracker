import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BusinessStoreState {
  selectedBusinessId: string | null;
  setSelectedBusiness: (id: string) => void;
  clearSelectedBusiness: () => void;
}

export const useBusinessStore = create<BusinessStoreState>()(
  persist(
    (set) => ({
      selectedBusinessId: null,
      setSelectedBusiness: (id) => set({ selectedBusinessId: id }),
      clearSelectedBusiness: () => set({ selectedBusinessId: null }),
    }),
    {
      name: 'simpletracker-business',
      partialize: (state) => ({
        selectedBusinessId: state.selectedBusinessId,
      }),
    },
  ),
);

export const useSelectedBusinessId = () =>
  useBusinessStore((s) => s.selectedBusinessId);

export const getSelectedBusinessId = () =>
  useBusinessStore.getState().selectedBusinessId;
