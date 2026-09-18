import {
  greenApiClient,
  getGreenApiUrl,
  normalizeGreenApiError,
  type Credentials,
} from '@/shared/api/green-api'
import type { CheckAccountRequest, CheckAccountResponse } from '../model/createChat.types'

export async function checkAccount(credentials: Credentials, body: CheckAccountRequest) {
  try {
    const response = await greenApiClient.post<CheckAccountResponse>(
      getGreenApiUrl(credentials, 'checkAccount'),
      body,
    )
    return response.data
  } catch (error) {
    throw normalizeGreenApiError(error, 'Не удалось найти пользователя MAX. Попробуйте ещё раз.')
  }
}
