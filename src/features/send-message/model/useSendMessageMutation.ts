import { useMutation } from '@tanstack/react-query'
import { useMessageStore } from '@/entities/message'
import { useSessionStore } from '@/entities/session'
import { greenApiKeys } from '@/shared/api/green-api'
import { sendMessage } from '../api/sendMessage'
import { MAX_MESSAGE_LENGTH } from './message.constants'

export function useSendMessageMutation(chatId: string) {
  const credentials = useSessionStore((state) => state.credentials)

  return useMutation({
    mutationKey: greenApiKeys.sendMessage,
    mutationFn: async (draft: string) => {
      const text = draft.trim()
      if (!credentials) throw new Error('Подключитесь к GREEN-API.')
      if (!text) throw new Error('Введите сообщение.')
      if (text.length > MAX_MESSAGE_LENGTH) throw new Error('Максимум 4000 символов в сообщении.')

      const data = await sendMessage(credentials, { chatId, message: text })
      if (typeof data.idMessage !== 'string' || !data.idMessage) {
        throw new Error('GREEN-API не подтвердил отправку сообщения. Проверьте соединение.')
      }
      return { id: data.idMessage, text, timestamp: Date.now() }
    },
    onSuccess: (message) => {
      if (useSessionStore.getState().credentials !== credentials) return
      useMessageStore.getState().addMessage({ ...message, chatId, direction: 'outgoing' })
    },
  })
}
