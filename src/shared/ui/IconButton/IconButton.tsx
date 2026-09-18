import type { ButtonHTMLAttributes } from 'react'
import styles from './IconButton.module.css'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'accent' | 'subtle'
}

export function IconButton({
  variant = 'subtle',
  type = 'button',
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`${styles.button} ${className}`}
      data-variant={variant}
    />
  )
}
