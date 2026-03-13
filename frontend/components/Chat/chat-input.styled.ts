import styled from 'styled-components';

export const InputWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Textarea = styled.textarea`
  width: 100%;
  max-height: 4rem;
  resize: none;
  background: var(--background);
  border: 1px solid #374151;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--foreground);
  &::placeholder {
    color: var(--muted-foreground);
    opacity: 0.4;
  }
  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px var(--background),
      0 0 0 4px var(--ring);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const RecordingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: rgba(239, 68, 68, 0.9);
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  width: max-content;
`;

export const RecordingDot = styled.span`
  display: inline-flex;
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  background: rgb(239 68 68);
  animation: pulse 1.5s ease-in-out infinite;
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export const FilePreviewList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);
`;

export const FilePreviewItem = styled.div`
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

export const RemoveFileButton = styled.button`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  height: 1rem;
  width: 1rem;
  border-radius: 9999px;
  background: var(--background);
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border: 1px solid rgb(var(--border));
  transition:
    background-color 0.15s,
    color 0.15s,
    border-color 0.15s;
  &:hover {
    background: var(--destructive);
    color: var(--destructive-foreground, white);
    border-color: var(--destructive);
  }
`;

export const FileThumb = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.375rem;
  overflow: hidden;
  background: color-mix(in srgb, var(--background) 40%, transparent);
  flex-shrink: 0;
`;

export const FileThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const FileThumbVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const FileInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

export const FileName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FileSize = styled.div`
  font-size: 0.6rem;
  opacity: 0.7;
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

export const KittyPopoverButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  border: none;
  background: transparent;
  transition: background-color 0.15s;
  &:hover:not(:disabled) {
    background: var(--muted);
  }
  &:disabled {
    opacity: 0.6;
  }
`;

export const MicIconWrapper = styled.span<{ $recording?: boolean }>`
  color: ${({ $recording }) => ($recording ? 'rgb(239 68 68)' : 'inherit')};
`;
