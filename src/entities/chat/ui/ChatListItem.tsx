import { Check } from 'lucide-react'
import { formatMessageTime } from '@/shared/lib/date'
import type { Chat } from '../model/chat.types'
import { ChatAvatar } from './ChatAvatar'
import styles from './ChatListItem.module.css'

type ChatListItemProps = {
  chat: Chat
  active: boolean
  preview?: string
  timestamp?: number
  outgoing?: boolean
  onSelect: () => void
}

export function ChatListItem({
  chat,
  active,
  preview,
  timestamp,
  outgoing,
  onSelect,
}: ChatListItemProps) {
  return (
    <button
      type="button"
      className={styles.item}
      data-active={active}
      aria-current={active ? 'true' : undefined}
      onClick={onSelect}
    >
      <ChatAvatar chat={chat} />
      <span className={styles.info}>
        <span className={styles.top}>
          <span className={styles.title}>{chat.title}</span>
          {timestamp !== undefined && (
            <time className={styles.time} dateTime={new Date(timestamp).toISOString()}>
              {formatMessageTime(timestamp)}
            </time>
          )}
        </span>
        <span className={styles.preview}>
          {outgoing && <Check size={15} aria-label="Отправлено" />}
          <span>{preview || 'Пока нет сообщений'}</span>
        </span>
      </span>
    </button>
  )
}
