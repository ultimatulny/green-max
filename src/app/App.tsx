import { QueryClientProvider } from '@tanstack/react-query'
import { AuthPage } from '@/pages/auth'
import { MessengerPage } from '@/pages/messenger'
import { useChatStore } from '@/entities/chat'
import { useMessageStore } from '@/entities/message'
import { useSessionStore } from '@/entities/session'
import { queryClient } from './providers/query-client/queryClient'

export function App() {
  const credentials = useSessionStore((state) => state.credentials)

  function disconnect() {
    useSessionStore.getState().disconnect()
    queryClient.clear()
    useChatStore.getState().reset()
    useMessageStore.getState().reset()
  }

  return (
    <QueryClientProvider client={queryClient}>
      {credentials ? (
        <MessengerPage credentials={credentials} onDisconnect={disconnect} />
      ) : (
        <AuthPage />
      )}
    </QueryClientProvider>
  )
}
