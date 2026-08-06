import { create } from 'zustand';

export interface AdminTab {
  id: string; // The full path, e.g. /admin/businesses/1/edit
  path: string;
  title: string;
}

interface AdminTabsState {
  tabs: AdminTab[];
  activePath: string;
  addTab: (tab: AdminTab) => void;
  removeTab: (path: string) => void;
  setActiveTab: (path: string) => void;
  updateTabTitle: (path: string, title: string) => void;
  setTabs: (tabs: AdminTab[]) => void;
}

export const useAdminTabsStore = create<AdminTabsState>((set) => ({
  tabs: [],
  activePath: '',
  addTab: (tab) => set((state) => {
    // If tab already exists, just make it active
    if (state.tabs.some(t => t.path === tab.path)) {
      return { activePath: tab.path };
    }
    // Otherwise add and make active
    return { 
      tabs: [...state.tabs, tab],
      activePath: tab.path
    };
  }),
  removeTab: (path) => set((state) => {
    const newTabs = state.tabs.filter(t => t.path !== path);
    // If we closed the active tab, switch to the last available tab
    let newActivePath = state.activePath;
    if (path === state.activePath) {
      newActivePath = newTabs.length > 0 ? newTabs[newTabs.length - 1].path : '/admin/overview';
    }
    return {
      tabs: newTabs,
      activePath: newActivePath
    };
  }),
  setActiveTab: (path) => set({ activePath: path }),
  updateTabTitle: (path, title) => set((state) => ({
    tabs: state.tabs.map(t => t.path === path ? { ...t, title } : t)
  })),
  setTabs: (tabs) => set({ tabs }),
}));
