import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppConfig } from '../types';
import { DEFAULT_CONTEXT_LINES, DEFAULT_FONT_SIZE } from '../config/constants';

interface ConfigStore {
  config: AppConfig;
  setApiKey: (key: string) => void;
  updateConfig: (updates: Partial<AppConfig>) => void;
  reset: () => void;
}

const defaultConfig: AppConfig = {
  apiKey: '',
  theme: 'dark',
  editorTheme: 'vs-dark',
  defaultLanguage: 'javascript',
  maxContextLines: DEFAULT_CONTEXT_LINES,
  autoSave: true,
  fontSize: DEFAULT_FONT_SIZE,
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: defaultConfig,
      setApiKey: (key) =>
        set((state) => ({
          config: { ...state.config, apiKey: btoa(key) }, // Base64 encode for obfuscation
        })),
      updateConfig: (updates) =>
        set((state) => ({
          config: { ...state.config, ...updates },
        })),
      reset: () => set({ config: defaultConfig }),
    }),
    {
      name: 'config-storage',
    }
  )
);

// Helper to get decoded API key
export const getDecodedApiKey = (encodedKey: string): string => {
  try {
    return atob(encodedKey);
  } catch {
    return encodedKey;
  }
};
