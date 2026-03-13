import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { MessageBubbleRow, MessageBubbleBubble, MessageBubbleAvatarWrap } from "./chat.styles";
import type { MessageBubbleProps } from "./types";
import { formatMessageTime } from "./utilities/utility";
import {
  MessageText,
  AttachmentsWrap,
  ImageAttachmentWrap,
  ImageAttachment,
  VideoAttachmentWrap,
  VideoAttachment,
  AudioAttachmentWrap,
  AudioAttachment,
  FileAttachmentWrap,
  FilePlaceholder,
  FileLink,
  FileSize,
  MetaRow,
  MetaTime,
  MetaStatus,
  MetaSending,
} from "./message-bubble.styled";

export function MessageBubble({
  message,
  attachments,
  avatar,
  isOwn,
  createdAt,
  status,
  theme,
}: MessageBubbleProps) {
  const timeLabel = formatMessageTime(createdAt);

  return (
    <MessageBubbleRow $isOwn={isOwn}>
      {!isOwn && (
        <MessageBubbleAvatarWrap>
          <Avatar style={{ width: "100%", height: "100%" }}>
            <AvatarImage src={avatar} alt="" />
          </Avatar>
        </MessageBubbleAvatarWrap>
      )}
      <MessageBubbleBubble $isOwn={isOwn} $theme={theme} $status={status}>
        <MessageText>{message}</MessageText>
        {attachments && attachments.length > 0 && (
          <AttachmentsWrap>
            {attachments.map((att) => {
              if (att.type.startsWith("image/")) {
                return (
                  <ImageAttachmentWrap key={att.url}>
                    <ImageAttachment src={att.url} alt={att.name} />
                  </ImageAttachmentWrap>
                );
              }
              if (att.type.startsWith("video/")) {
                return (
                  <VideoAttachmentWrap key={att.url}>
                    <VideoAttachment controls src={att.url} />
                  </VideoAttachmentWrap>
                );
              }
              if (att.type.startsWith("audio/")) {
                return (
                  <AudioAttachmentWrap key={att.url}>
                    <AudioAttachment controls src={att.url} />
                  </AudioAttachmentWrap>
                );
              }
              return (
                <FileAttachmentWrap key={att.url}>
                  <FilePlaceholder>
                    {att.type === "application/pdf" ? "PDF" : "FILE"}
                  </FilePlaceholder>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <FileLink href={att.url} target="_blank" rel="noopener noreferrer">
                      {att.name}
                    </FileLink>
                    {typeof att.size === "number" && att.size > 0 && (
                      <FileSize>{(att.size / (1024 * 1024)).toFixed(1)} MB</FileSize>
                    )}
                  </div>
                </FileAttachmentWrap>
              );
            })}
          </AttachmentsWrap>
        )}
        {(timeLabel || status) && (
          <MetaRow>
            {timeLabel && <MetaTime>{timeLabel}</MetaTime>}
            {status && isOwn && status !== "sending" && (
              <MetaStatus $read={status === "read"}>
                {status === "read" ? "Read" : "Sent"}
              </MetaStatus>
            )}
            {status === "sending" && (
              <MetaSending>{timeLabel ? "· Sending..." : "Sending..."}</MetaSending>
            )}
          </MetaRow>
        )}
      </MessageBubbleBubble>
    </MessageBubbleRow>
  );
}
