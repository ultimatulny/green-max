import { useMutation } from '@tanstack/react-query'
import { useChatStore, type Chat } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { greenApiKeys } from '@/shared/api/green-api'
import { formatPhoneNumber, normalizePhoneNumber } from '@/shared/lib/phone'
import { checkAccount } from '../api/checkAccount'

export function useCreateChatMutation() {
  const credentials = useSessionStore((state) => state.credentials)

  return useMutation({
    mutationKey: greenApiKeys.createChat,
    mutationFn: async (value: string): Promise<Chat> => {
      if (!credentials) throw new Error('Подключитесь к GREEN-API.')
      const phone = normalizePhoneNumber(value)

      if (!/^(7\d{10}|375\d{9})$/.test(phone)) {
        throw new Error('Введите номер в международном формате: +7 и 10 цифр или +375 и 9 цифр.')
      }

      const existing = useChatStore.getState().chats.find((chat) => chat.phone === phone)
      if (existing) return existing

      const account = await checkAccount(credentials, { phoneNumber: Number(phone) })
      if ('status' in account) {
        throw new Error(
          'Не удалось проверить номер. Проверьте состояние и лимиты инстанса в GREEN-API.',
        )
      }
      if (!account.exist || !/^\d+$/.test(account.chatId)) {
        throw new Error(
          'Пользователь MAX не найден. Проверьте номер и доступность поиска по телефону.',
        )
      }

      return { chatId: account.chatId, phone, title: formatPhoneNumber(phone) }
    },
    onSuccess: (chat) => {
      if (useSessionStore.getState().credentials !== credentials) return
      useChatStore.getState().upsertChat(chat)
      useChatStore.getState().setActiveChat(chat.chatId)
    },
  })
}
