import styled from "styled-components";

export const HeaderRoot = styled.div`
  display: flex;
  height: 4rem;
  align-items: center;
  border-bottom: 1px solid rgb(var(--border));
  padding: 0 1rem;
  flex-shrink: 0;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
`;

export const HeaderAvatarGroup = styled.div`
  position: relative;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
`;

export const HeaderAvatarLeft = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid var(--background);
  border-radius: 9999px;
  overflow: hidden;
`;

export const HeaderAvatarRight = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid var(--background);
  border-radius: 9999px;
  overflow: hidden;
`;

export const HeaderNameWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const HeaderName = styled.span`
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SettingsButton = styled.button`
  display: inline-flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: none;
  background: transparent;
  transition: background-color 0.15s;
  &:hover {
    background: var(--muted);
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 15rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(var(--border));
  background: var(--background);
  color: var(--foreground);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  padding: 0.75rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const DropdownLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted-foreground);
  margin-bottom: 0.5rem;
`;

export const ThemeButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ThemeButton = styled.button<{
  $active?: boolean;
  $variant?: "standard" | "love" | "friends";
}>`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  border: 1px solid rgb(var(--border));
  background: var(--background);
  color: var(--foreground);
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;

  ${({ $active, $variant }) => {
    if ($variant === "love") {
      if ($active)
        return "background: rgb(244 63 94); color: white; border-color: rgb(244 63 94);";
      return "background: rgba(255, 228, 230, 0.8); color: rgb(190 18 60); border-color: rgb(254 205 211);";
    }
    if ($variant === "friends") {
      if ($active)
        return "background: rgb(16 185 129); color: white; border-color: rgb(16 185 129);";
      return "background: rgba(236 254 255, 0.8); color: rgb(4 120 87); border-color: rgb(153 246 228);";
    }
    if ($active)
      return "background: var(--primary); color: var(--primary-foreground); border-color: var(--primary);";
    return "";
  }}

  .dark & {
    ${({ $active, $variant }) => {
      if ($variant === "love" && !$active)
        return "background: rgba(127 29 29, 0.4); color: rgb(254 243 199); border-color: rgb(153 27 27);";
      if ($variant === "friends" && !$active)
        return "background: rgba(6 78 59, 0.4); color: rgb(167 243 208); border-color: rgb(19 78 74);";
      return "";
    }}
  }
`;

export const DropdownDivider = styled.div`
  border-top: 1px solid rgb(var(--border));
  padding-top: 0.5rem;
`;

export const ParticipantsList = styled.div`
  max-height: 10rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ParticipantRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: background 0.15s;
  &:hover {
    background: color-mix(in srgb, var(--muted) 60%, transparent);
  }
`;

export const ParticipantName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.375rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.375rem;
  border: none;
  background: transparent;
  transition: background-color 0.15s;
  &:hover {
    background: var(--muted);
  }
`;

export const LeaveGroupButton = styled(DropdownButton)`
  &:hover {
    background: color-mix(in srgb, var(--destructive) 10%, transparent);
  }
  color: var(--destructive);
  border: 1px solid color-mix(in srgb, var(--destructive) 40%, transparent);
`;
