"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useState, useCallback, useRef } from "react"
import EmojiPicker from "emoji-picker-react"

import {
  Image,
  Smile,
  Mic,
  Paperclip
} from "lucide-react"

import { ChatInputRoot } from "./chat.styles"

export function ChatInput({
  onSend,
}: {
  onSend: (text: string, files?: File[]) => void
}) {

  const [message, setMessage] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isSupportedFileType = (file: File) =>
    file.type.startsWith("image/") || file.type.startsWith("video/")

  const send = useCallback(() => {
    const trimmed = message.trim()

    if (!trimmed && files.length === 0) return

    onSend(trimmed, files)

    setMessage("")
    setFiles([])
  }, [message, files, onSend])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    const valid = selected.filter(isSupportedFileType)
    const invalidCount = selected.length - valid.length
    if (invalidCount > 0) {
      // Basic feedback; could be replaced with a toast
      console.warn(`Skipped ${invalidCount} unsupported file(s). Only images and videos are allowed.`)
    }
    if (valid.length) {
      setFiles((prev) => [...prev, ...valid])
    }
    // Reset input so the same file can be selected again if needed
    e.target.value = ""
  }

  const addEmoji = (emoji: any) => {
    setMessage((prev) => prev + emoji.emoji)
  }

  return (
    <ChatInputRoot className="flex items-center gap-2 p-2 border-t">

      {/* File Upload */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip size={18} />
      </Button>

      <input
        type="file"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleFiles}
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
      >
        <Image size={18} />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Smile size={18} />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <EmojiPicker onEmojiClick={addEmoji} />
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => console.log("start voice recording")}
      >
        <Mic size={18} />
      </Button>

      <Input
        placeholder="Start a new message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Message input"
        className="flex-1"
      />

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2 pb-2 text-xs text-muted-foreground">
          {files.map((file, index) => (
            <span
              key={`${file.name}-${index}`}
              className="px-2 py-1 rounded-full bg-muted"
            >
              {file.name}
            </span>
          ))}
        </div>
      )}

      {/* Send */}
      <Button type="button" onClick={send}>
        Send
      </Button>
    </ChatInputRoot>
  )
}
