import type { Chat } from '@/entities/chat'
import type { Message } from '@/entities/message'
import { isRecord } from '@/shared/api/green-api'

import type { IncomingTextNotification, TextMessageData } from './notification.types'

function isTextMessageData(value: unknown): value is TextMessageData {
  if (!isRecord(value)) return false

  if (value.typeMessage === 'textMessage') {
    return isRecord(value.textMessageData) && typeof value.textMessageData.textMessage === 'string'
  }

  return (
    value.typeMessage === 'extendedTextMessage' &&
    isRecord(value.extendedTextMessageData) &&
    typeof value.extendedTextMessageData.text === 'string'
  )
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === 'string'
}

function isIncomingTextNotification(value: unknown): value is IncomingTextNotification {
  if (!isRecord(value) || !isRecord(value.senderData)) return false

  const sender = value.senderData

  return (
    value.typeWebhook === 'incomingMessageReceived' &&
    typeof value.idMessage === 'string' &&
    value.idMessage.length > 0 &&
    typeof value.timestamp === 'number' &&
    Number.isFinite(value.timestamp) &&
    value.timestamp >= 0 &&
    value.timestamp <= 8_640_000_000_000 &&
    typeof sender.chatId === 'string' &&
    /^[1-9]\d*$/.test(sender.chatId) &&
    (sender.chatType === undefined || sender.chatType === 'user') &&
    isOptionalString(sender.chatName) &&
    isOptionalString(sender.senderName) &&
    isOptionalString(sender.senderContactName) &&
    (sender.senderPhoneNumber === undefined ||
      (typeof sender.senderPhoneNumber === 'number' &&
        Number.isSafeInteger(sender.senderPhoneNumber))) &&
    isTextMessageData(value.messageData)
  )
}

export function mapIncomingNotification(body: unknown): { chat: Chat; message: Message } | null {
  if (!isIncomingTextNotification(body)) return null

  const { senderData, messageData } = body
  const text =
    messageData.typeMessage === 'textMessage'
      ? messageData.textMessageData.textMessage
      : messageData.extendedTextMessageData.text

  if (!text.trim()) return null

  const phone =
    senderData.senderPhoneNumber && senderData.senderPhoneNumber > 0
      ? String(senderData.senderPhoneNumber)
      : ''
  const title =
    senderData.senderContactName?.trim() ||
    senderData.senderName?.trim() ||
    senderData.chatName?.trim() ||
    (phone ? `+${phone}` : `Чат ${senderData.chatId}`)

  return {
    chat: { chatId: senderData.chatId, phone, title },
    message: {
      id: body.idMessage,
      chatId: senderData.chatId,
      text,
      timestamp: body.timestamp * 1_000,
      direction: 'incoming',
    },
  }
}
