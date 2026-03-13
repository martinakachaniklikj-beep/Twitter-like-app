import styled from 'styled-components';

export const MessageText = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
`;

export const AttachmentsWrap = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ImageAttachmentWrap = styled.div`
  max-width: 20rem;
`;

export const ImageAttachment = styled.img`
  border-radius: 0.375rem;
  max-height: 16rem;
  object-fit: cover;
  width: 100%;
`;

export const VideoAttachmentWrap = styled.div`
  max-width: 20rem;
`;

export const VideoAttachment = styled.video`
  border-radius: 0.375rem;
  max-height: 16rem;
  width: 100%;
`;

export const AudioAttachmentWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(var(--border));
  background: color-mix(in srgb, var(--muted) 60%, transparent);
  align-self: flex-start;
`;

export const AudioAttachment = styled.audio`
  width: 12rem;
  min-width: 10rem;
  height: 2rem;
`;

export const AudioAttachmentName = styled.div`
  min-width: 0;
  flex: 1;
  font-size: 0.7rem;
  color: var(--muted-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AudioAttachmentSize = styled.div`
  font-size: 0.6rem;
  color: var(--muted-foreground);
  opacity: 0.8;
`;

export const FileAttachmentWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(var(--border));
  background: color-mix(in srgb, var(--muted) 60%, transparent);
  padding: 0.25rem 0.5rem;
  max-width: 220px;
`;

export const FilePlaceholder = styled.div`
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background: color-mix(in srgb, var(--background) 40%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
`;

export const FileLink = styled.a`
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75rem;
  text-decoration: underline;
  color: inherit;
`;

export const FileSize = styled.div`
  font-size: 0.6rem;
  opacity: 0.7;
`;

export const MetaRow = styled.div`
  margin-top: 0.25rem;
  font-size: 0.65rem;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
`;

export const MetaTime = styled.span`
  color: var(--foreground);
  opacity: 0.8;
`;

export const MetaStatus = styled.span<{ $read?: boolean }>`
  font-weight: ${({ $read }) => ($read ? 600 : 400)};
  color: ${({ $read }) => ($read ? 'var(--foreground)' : 'var(--foreground); opacity: 0.7')};
`;

export const MetaSending = styled.span`
  color: var(--foreground);
  opacity: 0.7;
`;
