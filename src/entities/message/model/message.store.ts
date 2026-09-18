import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Message } from './message.types'

interface MessageState {
  messages: Message[]
  addMessage: (message: Message) => void
  reset: () => void
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) =>
        set((state) => {
          if (
            state.messages.some((item) => item.id === message.id && item.chatId === message.chatId)
          ) {
            return state
          }

          return { messages: [...state.messages, message] }
        }),
      reset: () => set({ messages: [] }),
    }),
    {
      name: 'green-max-messages',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ messages }) => ({ messages }),
    },
  ),
)
