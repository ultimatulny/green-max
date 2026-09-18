import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Credentials } from '@/shared/api/green-api'

interface SessionState {
  credentials: Credentials | null
  connect: (credentials: Credentials) => void
  disconnect: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      credentials: null,
      connect: (credentials) => set({ credentials }),
      disconnect: () => set({ credentials: null }),
    }),
    {
      name: 'green-max-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ credentials }) => ({ credentials }),
    },
  ),
)
