import { create } from 'zustand'

import type { Chat } from './chat.types'

interface ChatState {
  chats: Chat[]
  activeChatId: string | null
  upsertChat: (chat: Chat) => void
  setActiveChat: (chatId: string | null) => void
  reset: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChatId: null,
  upsertChat: (chat) =>
    set((state) => ({
      chats: state.chats.some((item) => item.chatId === chat.chatId)
        ? state.chats.map((item) => (item.chatId === chat.chatId ? chat : item))
        : [...state.chats, chat],
    })),
  setActiveChat: (activeChatId) => set({ activeChatId }),
  reset: () => set({ chats: [], activeChatId: null }),
}))
