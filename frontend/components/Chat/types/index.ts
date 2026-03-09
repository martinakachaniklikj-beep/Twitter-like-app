export type ChatAttachment = {
  url: string
  type: string
  name: string
  size: number
}

export type Message = {
  id: string
  text: string
  senderId: string
  conversationId: string
  createdAt: string
  status?: "sending" | "sent" | "delivered" | "read"
  attachments?: ChatAttachment[]
}
