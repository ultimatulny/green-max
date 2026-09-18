export interface NotificationEnvelope {
  receiptId: number
  body: unknown
}

export interface DeleteNotificationResponse {
  result: boolean
  reason?: string
}

export type TextMessageData =
  | { typeMessage: 'textMessage'; textMessageData: { textMessage: string } }
  | { typeMessage: 'extendedTextMessage'; extendedTextMessageData: { text: string } }

export interface IncomingTextNotification {
  typeWebhook: 'incomingMessageReceived'
  idMessage: string
  timestamp: number
  senderData: {
    chatId: string
    chatName?: string
    chatType?: string
    senderName?: string
    senderContactName?: string
    senderPhoneNumber?: number
  }
  messageData: TextMessageData
}
