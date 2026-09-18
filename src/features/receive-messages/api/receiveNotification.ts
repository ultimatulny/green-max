import {
  getGreenApiUrl,
  greenApiClient,
  isRecord,
  normalizeGreenApiError,
  type Credentials,
} from '@/shared/api/green-api'

import type { NotificationEnvelope } from '../model/notification.types'
import { RECEIVE_REQUEST_TIMEOUT_MS, RECEIVE_TIMEOUT_SECONDS } from '../model/receive.constants'

function isNotificationEnvelope(value: unknown): value is NotificationEnvelope {
  return (
    isRecord(value) &&
    typeof value.receiptId === 'number' &&
    Number.isSafeInteger(value.receiptId) &&
    value.receiptId >= 0 &&
    'body' in value
  )
}

export async function receiveNotification(
  credentials: Credentials,
  signal: AbortSignal,
): Promise<NotificationEnvelope | null> {
  try {
    const response = await greenApiClient.get<unknown>(
      getGreenApiUrl(credentials, 'receiveNotification'),
      {
        signal,
        timeout: RECEIVE_REQUEST_TIMEOUT_MS,
        params: { receiveTimeout: RECEIVE_TIMEOUT_SECONDS },
      },
    )

    const data = response.data

    if (data === null || data === '') return null
    if (!isNotificationEnvelope(data)) throw new Error('Invalid notification response')

    return data
  } catch (error: unknown) {
    throw normalizeGreenApiError(error, 'Не удалось получить сообщения')
  }
}
