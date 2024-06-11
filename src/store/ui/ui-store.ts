import { create } from 'zustand'

interface State {
  isSideMenuOpen: Boolean,
  openSideMenu  : () => void,
  closeSideMenu : () => void
}

export const useUIStore = create<State>()((set) => ({
  /* Estados */
  isSideMenuOpen: false,

  /* Métodos */
  openSideMenu : () => set({ isSideMenuOpen: true }),
  closeSideMenu: () => set({ isSideMenuOpen: false })
}))
