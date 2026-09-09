import { create } from "zustand";

/**
 * @typedef {object} UiStore
 * @property {boolean} sidebarOpen - Whether the dashboard sidebar drawer is open
 * @property {() => void} toggleSidebar - Toggle sidebar open/closed
 * @property {() => void} openSidebar - Open the sidebar
 * @property {() => void} closeSidebar - Close the sidebar
 */

/**
 * UI state store — sidebar open/close for the dashboard shell.
 */
export const useUiStore = create((set) => ({
  sidebarOpen: false,
  toggleSidebar: () =>
    set((/** @type {UiStore} */ state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
}));
