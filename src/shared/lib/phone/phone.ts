export function normalizePhoneNumber(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatPhoneNumber(value: string): string {
  const digits = normalizePhoneNumber(value)

  if (digits.length === 11 && digits.startsWith('7')) {
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
  }

  return digits ? `+${digits}` : value
}
