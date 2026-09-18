import { useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUp } from 'lucide-react'
import { IconButton } from '@/shared/ui/IconButton'
import { Spinner } from '@/shared/ui/Spinner'
import { useSendMessageMutation } from '../model/useSendMessageMutation'
import { MAX_MESSAGE_LENGTH } from '../model/message.constants'
import styles from './MessageComposer.module.css'

type MessageComposerProps = { chatId: string }

export function MessageComposer({ chatId }: MessageComposerProps) {
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const send = useSendMessageMutation(chatId)

  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = '0px'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [draft])

  function submit() {
    if (send.isPending || !draft.trim()) return
    send.mutate(draft, {
      onSuccess: () => {
        setDraft('')
        textareaRef.current?.focus()
      },
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submit()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form className={styles.area} onSubmit={handleSubmit}>
      {send.error && (
        <p className={styles.error} id="send-error" role="alert">
          {send.error.message}. Текст сохранён — попробуйте ещё раз.
        </p>
      )}
      <div className={styles.composer}>
        <textarea
          ref={textareaRef}
          rows={1}
          aria-label="Сообщение"
          aria-describedby={send.error ? 'send-error' : undefined}
          placeholder="Сообщение"
          maxLength={MAX_MESSAGE_LENGTH}
          readOnly={send.isPending}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value)
            if (send.isError) send.reset()
          }}
          onKeyDown={handleKeyDown}
        />
        <IconButton
          type="submit"
          variant="accent"
          aria-label="Отправить сообщение"
          title="Отправить · Enter"
          disabled={send.isPending || !draft.trim()}
        >
          {send.isPending ? <Spinner /> : <ArrowUp size={22} strokeWidth={2.2} />}
        </IconButton>
      </div>
    </form>
  )
}
