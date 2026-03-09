import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { MessageBubbleRow, MessageBubbleBubble } from "./chat.styles"
import type { Message, ChatAttachment } from "./types"

interface MessageBubbleProps {
  message: string
  attachments?: ChatAttachment[]
  avatar?: string
  isOwn?: boolean
  createdAt?: string
  status?: Message["status"]
}

export function MessageBubble({ message, attachments, avatar, isOwn, createdAt, status }: MessageBubbleProps) {
  const timeLabel =
    createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined

  return (
    <MessageBubbleRow $isOwn={isOwn}>
      {!isOwn && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={avatar} />
        </Avatar>
      )}
      <MessageBubbleBubble $isOwn={isOwn}>
        <div>{message}</div>
        {attachments && attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {attachments.map((att) => {
              if (att.type.startsWith("image/")) {
                return (
                  <div key={att.url} className="max-w-xs">
                    <img
                      src={att.url}
                      alt={att.name}
                      className="rounded-md max-h-64 object-cover"
                    />
                  </div>
                )
              }
              if (att.type.startsWith("video/")) {
                return (
                  <div key={att.url} className="max-w-xs">
                    <video
                      controls
                      src={att.url}
                      className="rounded-md max-h-64"
                    />
                  </div>
                )
              }
              return (
                <div key={att.url}>
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline break-all"
                  >
                    {att.name}
                  </a>
                </div>
              )
            })}
          </div>
        )}
        {(timeLabel || status) && (
          <div className="mt-1 text-[0.65rem] text-muted-foreground/80 text-right">
            {timeLabel}
            {status === "sending" && (timeLabel ? " · Sending..." : "Sending...")}
          </div>
        )}
      </MessageBubbleBubble>
    </MessageBubbleRow>
  )
}
