export type CheckAccountRequest = {
  phoneNumber: number
}

export type CheckAccountResponse =
  { exist: boolean; chatId: string; fromCache: boolean } | { status: false; reason: string }
