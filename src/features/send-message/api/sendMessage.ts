import {
  greenApiClient,
  getGreenApiUrl,
  normalizeGreenApiError,
  type Credentials,
} from '@/shared/api/green-api'
import type { SendMessageRequest, SendMessageResponse } from '../model/sendMessage.types'

export async function sendMessage(credentials: Credentials, body: SendMessageRequest) {
  try {
    const response = await greenApiClient.post<SendMessageResponse>(
      getGreenApiUrl(credentials, 'sendMessage'),
      body,
    )
    return response.data
  } catch (error) {
    throw normalizeGreenApiError(error, 'Не удалось отправить сообщение')
  }
}
