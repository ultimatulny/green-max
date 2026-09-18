import { create } from 'zustand'

import type { Credentials } from '@/shared/api/green-api'

interface SessionState {
  credentials: Credentials | null
  connect: (credentials: Credentials) => void
  disconnect: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  credentials: null,
  connect: (credentials) => set({ credentials }),
  disconnect: () => set({ credentials: null }),
}))
