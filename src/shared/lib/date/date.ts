const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
})

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatMessageTime(timestamp: number): string {
  return timeFormatter.format(timestamp)
}

export function isSameDay(first: number, second: number): boolean {
  return new Date(first).toDateString() === new Date(second).toDateString()
}

export function formatMessageDate(timestamp: number): string {
  const now = new Date()

  if (isSameDay(timestamp, now.getTime())) return 'Сегодня'

  now.setDate(now.getDate() - 1)

  if (isSameDay(timestamp, now.getTime())) return 'Вчера'

  return dateFormatter.format(timestamp)
}
