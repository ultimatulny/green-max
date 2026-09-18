import {
  greenApiClient,
  getGreenApiUrl,
  normalizeGreenApiError,
  type Credentials,
} from '@/shared/api/green-api'
import type { InstanceStateResponse } from '../model/auth.types'

export async function getStateInstance(credentials: Credentials) {
  try {
    const response = await greenApiClient.get<InstanceStateResponse>(
      getGreenApiUrl(credentials, 'getStateInstance'),
    )
    return response.data
  } catch (error) {
    throw normalizeGreenApiError(error, 'Не удалось подключиться к GREEN-API')
  }
}
