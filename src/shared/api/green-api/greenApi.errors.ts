import axios from 'axios'

export function normalizeGreenApiError(error: unknown, fallback: string): Error {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status

    if (status === 401 || status === 403) {
      return new Error('Проверьте idInstance и apiTokenInstance')
    }

    if (status === 429) {
      return new Error('Превышен лимит запросов GREEN-API. Попробуйте немного позже.')
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new Error(`${fallback}. Сервер не ответил вовремя.`)
    }

    if (!error.response && error.code !== 'ERR_CANCELED') {
      return new Error(`${fallback}. Проверьте подключение к интернету.`)
    }
  }

  return new Error(fallback)
}
