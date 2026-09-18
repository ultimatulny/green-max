import axios from 'axios'

import { GREEN_API_BASE_URL, GREEN_API_REQUEST_TIMEOUT_MS } from './greenApi.constants'
import type { Credentials, GreenApiMethod } from './greenApi.types'

export const greenApiClient = axios.create({
  baseURL: import.meta.env.VITE_GREEN_API_URL || GREEN_API_BASE_URL,
  timeout: GREEN_API_REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
})

export function getGreenApiUrl(
  credentials: Credentials,
  method: GreenApiMethod,
  suffix?: string | number,
): string {
  const instance = encodeURIComponent(credentials.idInstance)
  const token = encodeURIComponent(credentials.apiTokenInstance)
  const ending = suffix === undefined ? '' : `/${encodeURIComponent(String(suffix))}`

  return `/waInstance${instance}/${method}/${token}${ending}`
}
