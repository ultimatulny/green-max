import { ArrowLeft } from 'lucide-react'
import { ChatAvatar, type Chat } from '@/entities/chat'
import { IconButton } from '@/shared/ui/IconButton'
import styles from './ChatHeader.module.css'

type ChatHeaderProps = {
  chat: Chat
  onBack: () => void
}

export function ChatHeader({ chat, onBack }: ChatHeaderProps) {
  return (
    <header className={styles.header}>
      <IconButton className={styles.back} aria-label="Назад к чатам" onClick={onBack}>
        <ArrowLeft size={22} aria-hidden="true" />
      </IconButton>
      <ChatAvatar chat={chat} size="small" />
      <div className={styles.info}>
        <h2>{chat.title}</h2>
        <p>Чат в MAX</p>
      </div>
    </header>
  )
}
