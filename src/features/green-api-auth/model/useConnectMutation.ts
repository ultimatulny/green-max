import { useMutation } from '@tanstack/react-query'
import { useSessionStore, type Credentials } from '@/entities/session'
import { greenApiKeys } from '@/shared/api/green-api'
import { getStateInstance } from '../api/getStateInstance'

export function useConnectMutation(credentials: Credentials) {
  return useMutation({
    mutationKey: greenApiKeys.auth,
    gcTime: 0,
    mutationFn: async () => {
      const data = await getStateInstance(credentials)

      switch (data.stateInstance) {
        case 'authorized':
        case 'suspended':
          return
        case 'notAuthorized':
        case 'pendingPassword':
          throw new Error('Сначала авторизуйте MAX-инстанс в личном кабинете GREEN-API.')
        case 'starting':
          throw new Error('Инстанс запускается. Попробуйте подключиться через несколько минут.')
        case 'blocked':
          throw new Error(
            'Аккаунт MAX заблокирован. Проверьте инстанс в личном кабинете GREEN-API.',
          )
        default:
          throw new Error('Не удалось проверить состояние MAX-инстанса. Попробуйте ещё раз.')
      }
    },
    onSuccess: () => useSessionStore.getState().connect(credentials),
  })
}
