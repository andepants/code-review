import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Thread, Message, CodeSelection } from '../types';
import { THREAD_COLORS } from '../config/constants';

interface ThreadStore {
  threads: Thread[];
  activeThreadId: string | null;
  createThread: (selection: CodeSelection, documentId: string) => Thread;
  addMessage: (threadId: string, message: Omit<Message, 'timestamp'> & { id?: string }) => void;
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
          id: messageData.id || crypto.randomUUID(),
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
        set((state) => {
          const newThreads = state.threads.map((thread) => {
            // Check if this thread contains the message
            const hasMessage = thread.messages.some((msg) => msg.id === messageId);

            // Only update threads that contain the message
            if (!hasMessage) return thread;

            const updatedThread = {
              ...thread,
              messages: thread.messages.map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg
              ),
              updatedAt: new Date(), // Force re-render by updating timestamp
            };

            // Log streaming updates for debugging
            if (updates.content !== undefined) {
              console.log('[ThreadStore] Message updated, content length:', updates.content.length);
            }

            return updatedThread;
          });

          return { threads: newThreads };
        });
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
      // Ensure streaming updates aren't throttled by persist middleware
      partialize: (state) => ({
        threads: state.threads,
        activeThreadId: state.activeThreadId,
      }),
    }
  )
);
