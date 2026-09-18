import { MessageCircle } from 'lucide-react'
import { useChatStore } from '@/entities/chat'
import { useMessageStore } from '@/entities/message'
import { MessageComposer } from '@/features/send-message'
import { ChatHeader } from './ChatHeader'
import { MessagesArea } from './MessagesArea'
import styles from './ChatWindow.module.css'

export function ChatWindow() {
  const activeChatId = useChatStore((state) => state.activeChatId)
  const chats = useChatStore((state) => state.chats)
  const setActiveChat = useChatStore((state) => state.setActiveChat)
  const allMessages = useMessageStore((state) => state.messages)
  const chat = chats.find((item) => item.chatId === activeChatId)

  if (!chat) {
    return (
      <section className={styles.empty} aria-label="Окно чата">
        <div className={styles.emptyIcon}>
          <MessageCircle size={30} strokeWidth={1.4} aria-hidden="true" />
        </div>
        <h2>Выберите чат</h2>
        <p>или создайте новый</p>
      </section>
    )
  }

  const messages = allMessages
    .filter((message) => message.chatId === chat.chatId)
    .sort((first, second) => first.timestamp - second.timestamp)

  return (
    <section className={styles.window} aria-label={`Чат ${chat.title}`}>
      <ChatHeader chat={chat} onBack={() => setActiveChat(null)} />
      <MessagesArea messages={messages} chatId={chat.chatId} />
      <MessageComposer key={chat.chatId} chatId={chat.chatId} />
    </section>
  )
}
