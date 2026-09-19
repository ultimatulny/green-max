import { useState, type CSSProperties } from 'react'
import { WifiOff } from 'lucide-react'
import { ChatSidebar } from '@/widgets/chat-sidebar'
import { ChatWindow } from '@/widgets/chat-window'
import { CreateChatModal } from '@/features/create-chat'
import { useReceiveNotifications } from '@/features/receive-messages'
import { useChatStore } from '@/entities/chat'
import type { Credentials } from '@/entities/session'
import { useSidebarResize } from '../model/useSidebarResize'
import styles from './MessengerPage.module.css'

type MessengerPageProps = {
  credentials: Credentials
  onDisconnect: () => void
}

export function MessengerPage({ credentials, onDisconnect }: MessengerPageProps) {
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false)
  const activeChatId = useChatStore((state) => state.activeChatId)
  const notifications = useReceiveNotifications(credentials)
  const { layoutRef, width, detailsOpacity, isResizing, separatorProps } = useSidebarResize()

  return (
    <main className={styles.page}>
      {notifications.error && (
        <div className={styles.connectionError} role="status">
          <WifiOff size={15} aria-hidden="true" />
          <span>Не удалось получить сообщения. Повторяем подключение…</span>
        </div>
      )}
      <div
        ref={layoutRef}
        className={styles.layout}
        data-chat-open={activeChatId !== null}
        data-resizing={isResizing}
        style={
          {
            '--sidebar-width': `${width}px`,
            '--sidebar-details-opacity': detailsOpacity,
          } as CSSProperties
        }
      >
        <div id="chat-sidebar" className={styles.sidebar}>
          <ChatSidebar onCreateChat={() => setIsCreateChatOpen(true)} onDisconnect={onDisconnect} />
          <div className={styles.resizeHandle} {...separatorProps} />
        </div>
        <div className={styles.chat}>
          <ChatWindow />
        </div>
      </div>
      {isCreateChatOpen && <CreateChatModal onClose={() => setIsCreateChatOpen(false)} />}
    </main>
  )
}
