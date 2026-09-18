import { Fragment, useEffect, useRef } from 'react'
import { MessageBubble, type Message } from '@/entities/message'
import { formatMessageDate, isSameDay } from '@/shared/lib/date'
import styles from './MessagesArea.module.css'

type MessagesAreaProps = {
  messages: Message[]
  chatId: string
}

export function MessagesArea({ messages, chatId }: MessagesAreaProps) {
  const bottomAnchorRef = useRef<HTMLDivElement>(null)
  const lastMessageId = messages.at(-1)?.id

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ block: 'end', behavior: 'instant' })
  }, [chatId, lastMessageId])

  return (
    <div className={styles.area} role="log" aria-label="Сообщения" aria-relevant="additions">
      {messages.length === 0 ? (
        <div className={styles.empty}>
          <span>Пока нет сообщений</span>
          <p>Напишите первое сообщение</p>
        </div>
      ) : (
        <div className={styles.messages}>
          {messages.map((message, index) => {
            const previous = messages[index - 1]
            const startsDay = !previous || !isSameDay(previous.timestamp, message.timestamp)

            return (
              <Fragment key={message.id}>
                {startsDay && (
                  <div className={styles.date}>
                    <span>{formatMessageDate(message.timestamp)}</span>
                  </div>
                )}
                <MessageBubble message={message} />
              </Fragment>
            )
          })}
          <div ref={bottomAnchorRef} className={styles.anchor} />
        </div>
      )}
    </div>
  )
}
