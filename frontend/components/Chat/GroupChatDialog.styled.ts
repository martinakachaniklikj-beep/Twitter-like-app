import styled from "styled-components";

export const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
`;

export const RowLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LabelMain = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

export const LabelHint = styled.span`
  font-size: 0.75rem;
  color: var(--muted-foreground);
`;

export const ErrorText = styled.p`
  font-size: 0.75rem;
  color: var(--destructive);
  margin-top: 0.25rem;
`;

export const ParticipantsBox = styled.div`
  border: 1px solid rgb(var(--border));
  border-radius: 0.375rem;
  max-height: 16rem;
  overflow: auto;
`;

export const ParticipantsBoxHeader = styled.div`
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgb(var(--border));
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: color-mix(in srgb, var(--muted) 60%, transparent);
`;

export const ParticipantsBoxTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

export const ParticipantsBoxLoading = styled.span`
  font-size: 0.6875rem;
  color: var(--muted-foreground);
`;

export const ParticipantsBoxError = styled.div`
  padding: 0.75rem;
  font-size: 0.75rem;
  color: var(--destructive);
`;

export const ParticipantsBoxEmpty = styled.div`
  padding: 0.75rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);
`;

export const ParticipantList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: none;
`;

export const ParticipantListItem = styled.li`
  border-bottom: 1px solid rgb(var(--border));
  &:last-child {
    border-bottom: none;
  }
`;

export const ParticipantButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  text-align: left;
  transition: background-color 0.15s;
  cursor: pointer;
  &:hover {
    background: color-mix(in srgb, var(--muted) 60%, transparent);
  }
`;

export const ParticipantAvatarWrap = styled.div`
  flex-shrink: 0;
`;

export const ParticipantInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

export const ParticipantDisplayName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ParticipantUsername = styled.div`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  height: 1rem;
  width: 1rem;
  border-radius: 0.25rem;
  border: 1px solid rgb(var(--border));
  flex-shrink: 0;
`;
