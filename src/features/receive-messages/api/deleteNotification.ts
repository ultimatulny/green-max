import {
  getGreenApiUrl,
  greenApiClient,
  isRecord,
  normalizeGreenApiError,
  type Credentials,
} from '@/shared/api/green-api'

import type { DeleteNotificationResponse } from '../model/notification.types'

function isDeleteResponse(value: unknown): value is DeleteNotificationResponse {
  return (
    isRecord(value) &&
    typeof value.result === 'boolean' &&
    (value.reason === undefined || typeof value.reason === 'string')
  )
}

export async function deleteNotification(
  credentials: Credentials,
  receiptId: number,
  signal: AbortSignal,
): Promise<DeleteNotificationResponse> {
  try {
    const response = await greenApiClient.delete<unknown>(
      getGreenApiUrl(credentials, 'deleteNotification', receiptId),
      { signal },
    )
    const data = response.data

    if (!isDeleteResponse(data)) throw new Error('Invalid delete response')

    return data
  } catch (error: unknown) {
    throw normalizeGreenApiError(error, 'Не удалось подтвердить получение сообщения')
  }
}
