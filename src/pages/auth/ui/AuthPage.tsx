import { MessageCircle } from 'lucide-react'
import { CredentialsForm } from '@/features/green-api-auth'
import styles from './AuthPage.module.css'

export function AuthPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="auth-title">
        <div className={styles.mark} aria-hidden="true">
          <MessageCircle size={24} strokeWidth={1.8} />
        </div>
        <h1 id="auth-title">GREEN-API MAX Chat</h1>
        <p className={styles.subtitle}>Введите данные вашего GREEN-API инстанса</p>
        <CredentialsForm />
      </section>
    </main>
  )
}
