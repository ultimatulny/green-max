import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Message } from './message.types'

interface MessageState {
  messages: Message[]
  addMessage: (message: Message) => boolean
  reset: () => void
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messages: [],

      addMessage: (message) => {
        const exists = get().messages.some(
          (item) => item.id === message.id && item.chatId === message.chatId,
        )

        if (exists) {
          return false
        }

        set((state) => ({
          messages: [...state.messages, message],
        }))

        return true
      },
      reset: () => set({ messages: [] }),
    }),
    {
      name: 'green-max-messages',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ messages }) => ({ messages }),
    },
  ),
)
