import { LogOut, MessageCircle, Plus } from 'lucide-react'
import { ChatListItem, useChatStore } from '@/entities/chat'
import { useMessageStore } from '@/entities/message'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import styles from './ChatSidebar.module.css'

type ChatSidebarProps = {
  onCreateChat: () => void
  onDisconnect: () => void
}

export function ChatSidebar({ onCreateChat, onDisconnect }: ChatSidebarProps) {
  const chats = useChatStore((state) => state.chats)
  const activeChatId = useChatStore((state) => state.activeChatId)
  const setActiveChat = useChatStore((state) => state.setActiveChat)
  const messages = useMessageStore((state) => state.messages)
  const chatsWithPreview = chats
    .map((chat) => ({
      chat,
      lastMessage: messages
        .filter((message) => message.chatId === chat.chatId)
        .sort((first, second) => first.timestamp - second.timestamp)
        .at(-1),
    }))
    .sort(
      (first, second) => (second.lastMessage?.timestamp ?? 0) - (first.lastMessage?.timestamp ?? 0),
    )

  return (
    <aside className={styles.sidebar} aria-label="Чаты">
      <header className={styles.header}>
        <h1>Чаты</h1>
        <IconButton
          variant="accent"
          aria-label="Новый чат"
          title="Новый чат"
          onClick={onCreateChat}
        >
          <Plus size={21} aria-hidden="true" />
        </IconButton>
      </header>

      {chats.length > 0 ? (
        <nav className={styles.list} aria-label="Список чатов">
          {chatsWithPreview.map(({ chat, lastMessage }) => (
            <ChatListItem
              key={chat.chatId}
              chat={chat}
              active={chat.chatId === activeChatId}
              preview={lastMessage?.text}
              timestamp={lastMessage?.timestamp}
              outgoing={lastMessage?.direction === 'outgoing'}
              onSelect={() => setActiveChat(chat.chatId)}
            />
          ))}
        </nav>
      ) : (
        <div className={styles.empty}>
          <MessageCircle size={29} strokeWidth={1.4} aria-hidden="true" />
          <h2>Чатов пока нет</h2>
          <p>Создайте первый чат</p>
          <Button variant="secondary" onClick={onCreateChat}>
            Новый чат
          </Button>
        </div>
      )}

      <footer className={styles.footer}>
        <span>GREEN-API MAX Chat</span>
        <IconButton aria-label="Выйти из аккаунта" title="Выйти из аккаунта" onClick={onDisconnect}>
          <LogOut size={18} aria-hidden="true" />
        </IconButton>
      </footer>
    </aside>
  )
}
