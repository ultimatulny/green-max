export const greenApiKeys = {
  all: ['green-api'] as const,
  auth: ['green-api', 'auth'] as const,
  createChat: ['green-api', 'create-chat'] as const,
  sendMessage: ['green-api', 'send-message'] as const,
  notifications: (idInstance: string) => ['green-api', 'notifications', idInstance] as const,
}
