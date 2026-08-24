import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("anva-theme") || localStorage.getItem("streamify-theme") || "night",
  setTheme: (theme) => {
    localStorage.setItem("anva-theme", theme);
    set({ theme });
  },
}));
