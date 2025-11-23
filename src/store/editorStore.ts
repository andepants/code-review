import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CodeDocument, CodeSelection } from '../types';

interface EditorStore {
  document: CodeDocument | null;
  currentSelection: CodeSelection | null;
  setDocument: (doc: CodeDocument) => void;
  updateContent: (content: string) => void;
  setSelection: (selection: CodeSelection | null) => void;
  setLanguage: (language: string) => void;
  reset: () => void;
}

const initialState = {
  document: null,
  currentSelection: null,
};

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      ...initialState,
      setDocument: (doc) => set({ document: doc }),
      updateContent: (content) =>
        set((state) => ({
          document: state.document
            ? { ...state.document, content, updatedAt: new Date() }
            : null,
        })),
      setSelection: (selection) => set({ currentSelection: selection }),
      setLanguage: (language) =>
        set((state) => ({
          document: state.document
            ? { ...state.document, language, updatedAt: new Date() }
            : null,
        })),
      reset: () => set(initialState),
    }),
    {
      name: 'editor-storage',
    }
  )
);
