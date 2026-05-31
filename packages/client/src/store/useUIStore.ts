import { create } from 'zustand';

interface UIState {
  isAIPanelOpen: boolean;
  toggleAIPanel: () => void;
  setAIPanelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAIPanelOpen: false,
  toggleAIPanel: () => set((state) => ({ isAIPanelOpen: !state.isAIPanelOpen })),
  setAIPanelOpen: (open) => set({ isAIPanelOpen: open }),
}));
