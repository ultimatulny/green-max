import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'
import { Spinner } from '@/shared/ui/Spinner'
import { useConnectMutation } from '../model/useConnectMutation'
import styles from './CredentialsForm.module.css'

export function CredentialsForm() {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [validationError, setValidationError] = useState('')
  const connection = useConnectMutation({
    idInstance: idInstance.trim(),
    apiTokenInstance: apiTokenInstance.trim(),
  })
  const error = validationError || connection.error?.message

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (connection.isPending) return

    if (!/^\d+$/.test(idInstance.trim()) || !apiTokenInstance.trim()) {
      setValidationError('Введите числовой ID Instance и API Token Instance.')
      return
    }

    setValidationError('')
    connection.mutate()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
      <div className={styles.field}>
        <label htmlFor="instance-id">ID Instance</label>
        <input
          id="instance-id"
          name="instance-id"
          inputMode="numeric"
          placeholder="Введите idInstance"
          autoComplete="off"
          spellCheck={false}
          required
          disabled={connection.isPending}
          value={idInstance}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'auth-error' : undefined}
          onChange={(event) => {
            setIdInstance(event.target.value)
            setValidationError('')
            connection.reset()
          }}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="instance-token">API Token Instance</label>
        <div className={styles.tokenField}>
          <input
            id="instance-token"
            name="instance-token"
            type={showToken ? 'text' : 'password'}
            placeholder="Введите apiTokenInstance"
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="none"
            required
            disabled={connection.isPending}
            value={apiTokenInstance}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'auth-error' : undefined}
            onChange={(event) => {
              setApiTokenInstance(event.target.value)
              setValidationError('')
              connection.reset()
            }}
          />
          <IconButton
            type="button"
            aria-label={showToken ? 'Скрыть токен' : 'Показать токен'}
            aria-pressed={showToken}
            onClick={() => setShowToken(!showToken)}
          >
            {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
          </IconButton>
        </div>
      </div>
      {error && (
        <p className={styles.error} id="auth-error" role="alert">
          {error}
        </p>
      )}
      <Button className={styles.submit} type="submit" disabled={connection.isPending}>
        {connection.isPending && <Spinner />}
        {connection.isPending ? 'Подключение…' : 'Подключиться'}
      </Button>
    </form>
  )
}
