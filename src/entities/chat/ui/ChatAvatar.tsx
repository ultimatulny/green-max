import type { Chat } from '../model/chat.types'
import styles from './ChatAvatar.module.css'

type ChatAvatarProps = {
  chat: Chat
  size?: 'small' | 'regular'
}

export function ChatAvatar({ chat, size = 'regular' }: ChatAvatarProps) {
  const color = Array.from(chat.chatId).reduce((hash, char) => hash + char.charCodeAt(0), 0) % 5
  const label = chat.phone ? chat.phone.slice(-2) : chat.title.slice(0, 1).toUpperCase()

  return (
    <span className={styles.avatar} data-color={color} data-size={size} aria-hidden="true">
      {label}
    </span>
  )
}
