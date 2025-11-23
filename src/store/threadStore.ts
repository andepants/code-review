import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Thread, Message, CodeSelection } from '../types';
import { THREAD_COLORS } from '../config/constants';

interface ThreadStore {
  threads: Thread[];
  activeThreadId: string | null;
  createThread: (selection: CodeSelection, documentId: string) => Thread;
  addMessage: (threadId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  setActiveThread: (threadId: string | null) => void;
  resolveThread: (threadId: string) => void;
  reopenThread: (threadId: string) => void;
  deleteThread: (threadId: string) => void;
  getThreadsByLine: (lineNumber: number) => Thread[];
  reset: () => void;
}

const initialState = {
  threads: [],
  activeThreadId: null,
};

export const useThreadStore = create<ThreadStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      createThread: (selection, documentId) => {
        const thread: Thread = {
          id: crypto.randomUUID(),
          documentId,
          selection,
          messages: [],
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          colorIndex: (get().threads.length % THREAD_COLORS.length) + 1,
        };
        set((state) => ({
          threads: [...state.threads, thread],
          activeThreadId: thread.id,
        }));
        return thread;
      },
      addMessage: (threadId, messageData) => {
        const message: Message = {
          ...messageData,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? {
                  ...thread,
                  messages: [...thread.messages, message],
                  updatedAt: new Date(),
                }
              : thread
          ),
        }));
      },
      updateMessage: (messageId, updates) => {
        set((state) => ({
          threads: state.threads.map((thread) => ({
            ...thread,
            messages: thread.messages.map((msg) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
          })),
        }));
      },
      setActiveThread: (threadId) => set({ activeThreadId: threadId }),
      resolveThread: (threadId) => {
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? { ...thread, status: 'resolved' as const, updatedAt: new Date() }
              : thread
          ),
        }));
      },
      reopenThread: (threadId) => {
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? { ...thread, status: 'active' as const, updatedAt: new Date() }
              : thread
          ),
        }));
      },
      deleteThread: (threadId) => {
        set((state) => ({
          threads: state.threads.filter((thread) => thread.id !== threadId),
          activeThreadId:
            state.activeThreadId === threadId ? null : state.activeThreadId,
        }));
      },
      getThreadsByLine: (lineNumber) => {
        return get().threads.filter(
          (thread) =>
            lineNumber >= thread.selection.startLine &&
            lineNumber <= thread.selection.endLine
        );
      },
      reset: () => set(initialState),
    }),
    {
      name: 'thread-storage',
    }
  )
);
