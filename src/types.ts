export type Email = {
  id: number
  from: string
  subject: string
  body: string
  sentAt: string
  archived: boolean
  read: boolean
}

export type EmailList = Email[]