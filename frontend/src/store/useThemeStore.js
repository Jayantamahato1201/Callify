import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Callify-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("Callify-theme", theme);
    set({ theme });
  },
}));
