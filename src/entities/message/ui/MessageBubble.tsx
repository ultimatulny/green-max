import { Check } from 'lucide-react'
import { formatMessageTime } from '@/shared/lib/date'
import type { Message } from '../model/message.types'
import styles from './MessageBubble.module.css'

type MessageBubbleProps = {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={styles.row} data-direction={message.direction}>
      <div className={styles.bubble}>
        <span className={styles.text}>{message.text}</span>
        <span className={styles.meta}>
          <time dateTime={new Date(message.timestamp).toISOString()}>
            {formatMessageTime(message.timestamp)}
          </time>
          {message.direction === 'outgoing' && <Check size={13} aria-label="Отправлено" />}
        </span>
      </div>
    </div>
  )
}
