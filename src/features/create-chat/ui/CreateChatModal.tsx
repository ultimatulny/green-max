import { useState, type FormEvent } from 'react'
import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'
import { useCreateChatMutation } from '../model/useCreateChatMutation'
import styles from './CreateChatModal.module.css'

type CreateChatModalProps = { onClose: () => void }

export function CreateChatModal({ onClose }: CreateChatModalProps) {
  const [phone, setPhone] = useState('')
  const creation = useCreateChatMutation()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (creation.isPending) return
    creation.mutate(phone, { onSuccess: onClose })
  }

  return (
    <Modal title="Новый чат" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.description}>Начните переписку с пользователем MAX.</p>
        <div className={styles.field}>
          <label htmlFor="chat-phone">Номер телефона</label>
          <input
            id="chat-phone"
            type="tel"
            inputMode="tel"
            autoFocus
            autoComplete="tel"
            placeholder="+7 999 123-45-67"
            required
            maxLength={32}
            disabled={creation.isPending}
            value={phone}
            aria-invalid={Boolean(creation.error)}
            aria-describedby={creation.error ? 'create-chat-error' : 'chat-phone-hint'}
            onChange={(event) => {
              setPhone(event.target.value)
              creation.reset()
            }}
          />
          <p id="chat-phone-hint" className={styles.hint}>
            В международном формате, с кодом страны.
          </p>
        </div>
        {creation.error && (
          <p id="create-chat-error" className={styles.error} role="alert">
            {creation.error.message}
          </p>
        )}
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" disabled={creation.isPending || !phone.trim()}>
            {creation.isPending && <Spinner />}
            {creation.isPending ? 'Проверка…' : 'Создать'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
