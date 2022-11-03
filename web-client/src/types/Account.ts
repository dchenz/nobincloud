export type AccountSignupDetails = {
  email: string
  nickname: string
  password: string
}

export type AccountLoginDetails = {
  email: string
  password: string
}

export type LoggedInSetup = {
  masterKey: ArrayBuffer
  wrappedKey: ArrayBuffer
}