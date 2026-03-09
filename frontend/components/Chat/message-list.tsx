import { useEffect, useMemo, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Message } from "./types"
import { MessageBubble } from "./message-bubble"

export function MessageList({
  messages,
  onLoadMore,
  currentUserId,
  loading,
  loadingMore,
}: {
  messages: Message[]
  onLoadMore: () => void
  currentUserId?: string
  loading?: boolean
  loadingMore?: boolean
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const uniqueMessages = useMemo(() => {
    const seen = new Set<string>()
    return messages.filter((m) => {
      if (seen.has(m.id)) return false
      seen.add(m.id)
      return true
    })
  }, [messages])

  useEffect(() => {
    if (!loading && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [uniqueMessages.length, loading])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
        Loading messages...
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 min-h-0">
      {loadingMore && (
        <div className="p-2 text-center text-sm text-muted-foreground">
          Loading older messages...
        </div>
      )}
      <div className="flex flex-col gap-4 p-4">
        {uniqueMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg.text}
            attachments={msg.attachments}
            createdAt={msg.createdAt}
            status={msg.status}
            isOwn={currentUserId ? msg.senderId === currentUserId : undefined}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
