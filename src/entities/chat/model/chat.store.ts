import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Chat } from './chat.types'

interface ChatState {
  chats: Chat[]
  activeChatId: string | null
  upsertChat: (chat: Chat) => void
  incrementUnread: (chatId: string) => void
  markChatAsRead: (chatId: string) => void
  setActiveChat: (chatId: string | null) => void
  reset: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      activeChatId: null,
      upsertChat: (chat) =>
        set((state) => ({
          chats: state.chats.some((item) => item.chatId === chat.chatId)
            ? state.chats.map((item) =>
                item.chatId === chat.chatId ? { ...chat, unreadCount: item.unreadCount } : item,
              )
            : [...state.chats, chat],
        })),
      incrementUnread: (chatId) =>
        set((state) => {
          if (state.activeChatId === chatId) return state

          return {
            chats: state.chats.map((chat) =>
              chat.chatId === chatId ? { ...chat, unreadCount: chat.unreadCount + 1 } : chat,
            ),
          }
        }),
      markChatAsRead: (chatId) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.chatId === chatId ? { ...chat, unreadCount: 0 } : chat,
          ),
        })),
      setActiveChat: (activeChatId) =>
        set((state) => ({
          activeChatId,
          chats: state.chats.map((chat) =>
            chat.chatId === activeChatId ? { ...chat, unreadCount: 0 } : chat,
          ),
        })),
      reset: () => set({ chats: [], activeChatId: null }),
    }),
    {
      name: 'green-max-chats',
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as Pick<ChatState, 'chats' | 'activeChatId'>

        return {
          ...state,
          chats: state.chats.map((chat) => ({ ...chat, unreadCount: chat.unreadCount ?? 0 })),
        }
      },
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ chats, activeChatId }) => ({ chats, activeChatId }),
    },
  ),
)
