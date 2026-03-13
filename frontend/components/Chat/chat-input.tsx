"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useState, useCallback, useRef, useEffect, type KeyboardEvent } from "react";
import EmojiPicker from "emoji-picker-react";
import { Image, Smile, Mic, Paperclip, Cat } from "lucide-react";
import { ChatInputRoot } from "./chat.styles";
import { useComposer } from "../../contexts/ComposerContext";
import { useAuth } from "@/contexts/AuthContext";
import { aiServices } from "@/services/aiServices";
import { useChatSocket } from "@/contexts/ChatSocketContext";
import type { ChatInputProps } from "./types";
import {
  InputWrap,
  Textarea,
  RecordingBadge,
  RecordingDot,
  FilePreviewList,
  FilePreviewItem,
  RemoveFileButton,
  FileThumb,
  FileThumbImg,
  FileThumbVideo,
  FileInfo,
  FileName,
  FileSize,
  FilePlaceholder,
  KittyPopoverButton,
  MicIconWrapper,
} from "./chat-input.styled";

const MAX_MESSAGE_TEXT_LENGTH = 2000;
const MAX_ATTACHMENT_SIZE_BYTES = 50 * 1024 * 1024;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BrowserSpeechRecognition = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BrowserSpeechRecognitionEvent = any;

export function ChatInput({ onSend, conversationId }: ChatInputProps) {

  const [message, setMessage] = useState("")
  const [kittyOpen, setKittyOpen] = useState(false)
  const [isFixing, setIsFixing] = useState(false)
  const [isDescribingImage, setIsDescribingImage] = useState(false)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const { state, dispatch } = useComposer()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const kittyImageInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { user } = useAuth()
  const { emitTyping } = useChatSocket()
  const typingTimeoutRef = useRef<number | null>(null)
  const [isTyping, setIsTyping] = useState(false)

  const isSupportedFileType = (file: File) =>
    file.type.startsWith("image/") ||
    file.type.startsWith("video/") ||
    file.type.startsWith("audio/")

  const send = useCallback(() => {
    const trimmed = message.trim()

    if (!trimmed && state.files.length === 0) return

    if (trimmed.length > MAX_MESSAGE_TEXT_LENGTH) {
      console.warn(
        `Message is too long. Maximum length is ${MAX_MESSAGE_TEXT_LENGTH} characters.`
      )
      return
    }

    onSend(trimmed, state.files)

    setMessage("")
    dispatch({ type: "CLEAR_FILES" })
  }, [message, state.files, onSend, dispatch])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const handleTypingChange = (value: string) => {
    setMessage(value)

    if (!conversationId) {
      return
    }

    if (!isTyping) {
      setIsTyping(true)
      emitTyping(conversationId, true)
    }

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false)
      if (conversationId) {
        emitTyping(conversationId, false)
      }
    }, 2000)
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current)
      }
      if (isTyping && conversationId) {
        emitTyping(conversationId, false)
      }
    }
  }, [conversationId, emitTyping, isTyping])

  // Auto-resize the textarea up to 2 lines, then enable scroll
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const style = window.getComputedStyle(textarea)
    const lineHeight = parseFloat(style.lineHeight || "0") || 20
    const maxLines = 2
    const maxHeight = lineHeight * maxLines

    textarea.style.height = "auto"

    const newHeight = Math.min(textarea.scrollHeight, maxHeight)
    textarea.style.height = `${newHeight}px`
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden"
  }, [message])

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    const validByType = selected.filter(isSupportedFileType)
    const invalidTypeCount = selected.length - validByType.length

    const validBySize = validByType.filter((file) => file.size <= MAX_ATTACHMENT_SIZE_BYTES)
    const tooLargeCount = validByType.length - validBySize.length

    if (invalidTypeCount > 0) {
      console.warn(
        `Skipped ${invalidTypeCount} unsupported file(s). Only images, videos, and audio are allowed.`
      )
    }
    if (tooLargeCount > 0) {
      console.warn(
        `Skipped ${tooLargeCount} file(s) larger than ${(MAX_ATTACHMENT_SIZE_BYTES / (1024 * 1024)).toFixed(
          0
        )} MB.`
      )
    }

    if (validBySize.length) {
      dispatch({ type: "ADD_FILES", files: validBySize })
    }
    // Reset input so the same file can be selected again if needed
    e.target.value = ""
  }

  const addEmoji = (emoji: any) => {
    setMessage((prev) => prev + emoji.emoji)
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const SpeechRecognitionCtor: BrowserSpeechRecognition | undefined =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionCtor || typeof SpeechRecognitionCtor !== "function") {
      recognitionRef.current = null
      return
    }
    const recognition = new (SpeechRecognitionCtor as any)()
    recognition.lang = "en-US"
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
      let finalTranscript = ""
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        }
      }
      if (finalTranscript) {
        setMessage((prev) => (prev ? `${prev} ${finalTranscript}` : finalTranscript))
      }
    }

    recognition.onend = () => {
      setIsTranscribing(false)
    }

    recognitionRef.current = recognition as BrowserSpeechRecognition

    return () => {
      recognition.stop()
    }
  }, [])

  const toggleSpeechToText = () => {
    if (!recognitionRef.current) {
      console.warn("Speech recognition is not supported in this browser.")
      return
    }

    if (isTranscribing) {
      recognitionRef.current.stop()
      setIsTranscribing(false)
      return
    }

    try {
      recognitionRef.current.start()
      setIsTranscribing(true)
    } catch (err) {
      console.error("Failed to start speech recognition", err)
    }
  }

  const stopAudioStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }
  }

  const toggleAudioRecording = async () => {
    if (isRecordingAudio) {
      mediaRecorderRef.current?.stop()
      setIsRecordingAudio(false)
      stopAudioStream()
      return
    }

    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      console.warn("Audio recording is not supported in this browser.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      const recorder = new MediaRecorder(stream)
      audioChunksRef.current = []

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        if (blob.size === 0) return

        const file = new File(
          [blob],
          `voice-message-${Date.now()}.webm`,
          { type: "audio/webm" },
        )

        dispatch({ type: "ADD_FILES", files: [file] })
        stopAudioStream()
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecordingAudio(true)
    } catch (err) {
      console.error("Failed to start audio recording", err)
      stopAudioStream()
    }
  }

  const handleFixText = async () => {
    const trimmed = message.trim()
    if (!trimmed || !user) return
    setIsFixing(true)
    try {
      const token = await user.getIdToken()
      const result = await aiServices.fixText(token, trimmed)
      setMessage(result.text)
    } catch (err) {
      console.error("Kitty Bot fix text failed", err)
    } finally {
      setIsFixing(false)
      setKittyOpen(false)
    }
  }

  const handleKittyImage = () => {
    kittyImageInputRef.current?.click()
  }

  const handleKittyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (!file.type.startsWith("image/")) {
      console.warn("Kitty Bot can only read image files.")
      e.target.value = ""
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      const result = reader.result
      if (typeof result !== "string") return
      const [header, base64] = result.split(",")
      const mimeMatch = header?.match(/data:(.*);base64/)
      const mimeType = mimeMatch?.[1] || file.type

      setIsDescribingImage(true)
      try {
        const token = await user.getIdToken()
        const res = await aiServices.describeImage(token, base64, mimeType)
        setMessage(res.text)
      } catch (err) {
        console.error("Kitty Bot describe image failed", err)
      } finally {
        setIsDescribingImage(false)
        setKittyOpen(false)
        e.target.value = ""
      }
    }
    reader.readAsDataURL(file)
  }

  const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      // Dynamically require pdfjs-dist at runtime; typed as any to avoid TS dependency
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pdfjsLib: any = require("pdfjs-dist")

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      let fullText = ""

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const content = await page.getTextContent()
        const strings = content.items.map((item: any) => item.str || "").filter(Boolean)
        fullText += strings.join(" ") + "\n\n"
      }

      return fullText.trim()
    } catch (err) {
      console.error("Failed to extract text from PDF", err)
      return ""
    }
  }

  const handleDocToText = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

    try {
      let text = ""

      if (isPdf) {
        text = await extractTextFromPdf(file)
      } else {
        const reader = new FileReader()
        text = await new Promise<string>((resolve) => {
          reader.onload = () => {
            resolve(typeof reader.result === "string" ? reader.result : "")
          }
          reader.readAsText(file)
        })
      }

      if (!text.trim()) {
        console.warn("No text content could be extracted from the document.")
        e.target.value = ""
        return
      }

      setMessage(text)
      setKittyOpen(false)
    } finally {
      e.target.value = ""
    }
  }

  return (
    <ChatInputRoot style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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

      <Button variant="ghost" size="icon" onClick={toggleAudioRecording}>
        <MicIconWrapper $recording={isRecordingAudio}>
          <Mic size={18} />
        </MicIconWrapper>
      </Button>

      <Popover open={kittyOpen} onOpenChange={setKittyOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Kitty Bot helpers"
          >
            <Cat size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent style={{ width: "14rem", padding: "0.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <KittyPopoverButton
              type="button"
              onClick={handleFixText}
              disabled={isFixing || !message.trim()}
            >
              {isFixing ? "Polishing text..." : "Fix my text with AI"}
            </KittyPopoverButton>
            <KittyPopoverButton
              type="button"
              onClick={handleKittyImage}
              disabled={isDescribingImage}
            >
              {isDescribingImage ? "Reading image..." : "Recognize image (describe)"}
            </KittyPopoverButton>
            <KittyPopoverButton type="button" onClick={() => docInputRef.current?.click()}>
              Upload document → text
            </KittyPopoverButton>
            <KittyPopoverButton
              type="button"
              onClick={toggleSpeechToText}
              disabled={!recognitionRef.current}
            >
              {isTranscribing ? "Listening (speech → text)..." : "Dictate with voice (speech → text)"}
            </KittyPopoverButton>
          </div>
        </PopoverContent>
      </Popover>

      <input
        type="file"
        accept="image/*"
        hidden
        ref={kittyImageInputRef}
        onChange={handleKittyImageChange}
      />
      <input
        type="file"
        accept=".txt,.md,text/plain,application/pdf,.pdf"
        hidden
        ref={docInputRef}
        onChange={handleDocToText}
      />

      <InputWrap>
        <Textarea
          ref={textareaRef}
          rows={1}
          placeholder="Start a new message"
          value={message}
          onChange={(e) => handleTypingChange(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Message input"
        />

        {isRecordingAudio && (
          <RecordingBadge>
            <RecordingDot />
            <span>Recording voice message… tap mic to stop</span>
          </RecordingBadge>
        )}

        {state.files.length > 0 && (
          <FilePreviewList>
            {state.files.map((file: File, index: number) => {
              const key = `${file.name}-${index}-${file.size}`;
              const isImage = file.type.startsWith("image/");
              const isVideo = file.type.startsWith("video/");
              const isAudio = file.type.startsWith("audio/");
              const objectUrl = URL.createObjectURL(file);

              return (
                <FilePreviewItem key={key}>
                  <RemoveFileButton
                    type="button"
                    onClick={() => dispatch({ type: "REMOVE_FILE", index })}
                    aria-label="Remove attachment"
                  >
                    ×
                  </RemoveFileButton>
                  {isImage && (
                    <FileThumb>
                      <FileThumbImg src={objectUrl} alt={file.name} />
                    </FileThumb>
                  )}
                  {isVideo && (
                    <FileThumb>
                      <FileThumbVideo src={objectUrl} muted />
                    </FileThumb>
                  )}
                  {isAudio && (
                    <div style={{ flexShrink: 0, width: "100%" }}>
                      <audio src={objectUrl} controls style={{ width: "100%" }} />
                    </div>
                  )}
                  {!isImage && !isVideo && !isAudio && (
                    <FilePlaceholder>FILE</FilePlaceholder>
                  )}
                  <FileInfo>
                    <FileName>{file.name}</FileName>
                    <FileSize>{(file.size / 1024 / 1024).toFixed(1)} MB</FileSize>
                  </FileInfo>
                </FilePreviewItem>
              );
            })}
          </FilePreviewList>
        )}
      </InputWrap>

      {/* Send */}
      <Button type="button" onClick={send}>
        Send
      </Button>
    </ChatInputRoot>
  )
}
