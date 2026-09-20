import { useQuery } from '@tanstack/react-query'

import { useChatStore } from '@/entities/chat'
import { useMessageStore } from '@/entities/message'
import { useSessionStore } from '@/entities/session'
import { greenApiKeys, type Credentials } from '@/shared/api/green-api'

import { deleteNotification } from '../api/deleteNotification'
import { receiveNotification } from '../api/receiveNotification'
import { mapIncomingNotification } from './notification.mapper'
import { RECEIVE_ERROR_INTERVAL_MS, RECEIVE_INTERVAL_MS } from './receive.constants'

export function useReceiveNotifications(credentials: Credentials) {
  return useQuery({
    queryKey: greenApiKeys.notifications(credentials.idInstance),
    queryFn: async ({ signal }) => {
      const notification = await receiveNotification(credentials, signal)
      const currentCredentials = useSessionStore.getState().credentials

      if (
        !notification ||
        signal.aborted ||
        !currentCredentials ||
        currentCredentials.idInstance !== credentials.idInstance ||
        currentCredentials.apiTokenInstance !== credentials.apiTokenInstance
      ) {
        return null
      }

      const incoming = mapIncomingNotification(notification.body)

      if (incoming) {
        const chatStore = useChatStore.getState()

        if (!chatStore.chats.some((chat) => chat.chatId === incoming.chat.chatId)) {
          chatStore.upsertChat(incoming.chat)
        }

        const added = useMessageStore.getState().addMessage(incoming.message)

        if (added) {
          useChatStore.getState().incrementUnread(incoming.message.chatId)
        }
      }

      await deleteNotification(credentials, notification.receiptId, signal)

      return notification.receiptId
    },
    gcTime: 0,
    retry: 2,
    retryDelay: (attempt) => Math.min(2_000 * 2 ** attempt, RECEIVE_ERROR_INTERVAL_MS),
    refetchInterval: (query) =>
      query.state.status === 'error' ? RECEIVE_ERROR_INTERVAL_MS : RECEIVE_INTERVAL_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}
