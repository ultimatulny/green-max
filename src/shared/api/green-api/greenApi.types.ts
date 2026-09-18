export interface Credentials {
  idInstance: string
  apiTokenInstance: string
}

export type GreenApiMethod =
  'getStateInstance' | 'checkAccount' | 'sendMessage' | 'receiveNotification' | 'deleteNotification'

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
