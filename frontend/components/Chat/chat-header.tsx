"use client";

import { useState } from "react";
import { BellOff, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { ChatHeaderProps } from "./types";
import { shuffleArray } from "./utilities/utility";
import {
  HeaderRoot,
  HeaderLeft,
  HeaderAvatarGroup,
  HeaderAvatarLeft,
  HeaderAvatarRight,
  HeaderNameWrap,
  HeaderName,
  SettingsButton,
  Dropdown,
  DropdownLabel,
  ThemeButtons,
  ThemeButton,
  DropdownDivider,
  ParticipantsList,
  ParticipantRow,
  ParticipantName,
  DropdownButton,
  LeaveGroupButton,
} from "./chat-header.styled";

export function ChatHeader({
  name,
  avatarUrl,
  theme,
  onThemeChange,
  muted,
  onToggleMute,
  type,
  participants,
  currentUserId,
  onLeaveGroup,
  leavingGroup,
}: ChatHeaderProps) {
  const [open, setOpen] = useState(false);

  const otherParticipants = participants.filter((p) => p.userId !== currentUserId);
  const groupAvatarCandidates =
    otherParticipants.length <= 2
      ? otherParticipants
      : shuffleArray(otherParticipants).slice(0, 2);
  const primaryGroupUser = groupAvatarCandidates[0];
  const secondaryGroupUser = groupAvatarCandidates[1];

  return (
    <HeaderRoot>
      <HeaderLeft>
        {type === "group" ? (
          <HeaderAvatarGroup>
            <HeaderAvatarLeft>
              <Avatar style={{ width: "100%", height: "100%" }}>
                <AvatarImage
                  src={(primaryGroupUser?.avatarUrl as string | undefined) ?? undefined}
                  alt={primaryGroupUser?.displayName || primaryGroupUser?.username || "User"}
                />
              </Avatar>
            </HeaderAvatarLeft>
            {secondaryGroupUser && (
              <HeaderAvatarRight>
                <Avatar style={{ width: "100%", height: "100%" }}>
                  <AvatarImage
                    src={(secondaryGroupUser.avatarUrl as string | undefined) ?? undefined}
                    alt={
                      secondaryGroupUser.displayName ||
                      secondaryGroupUser.username ||
                      "User"
                    }
                  />
                </Avatar>
              </HeaderAvatarRight>
            )}
          </HeaderAvatarGroup>
        ) : (
          <Avatar style={{ width: "2.25rem", height: "2.25rem" }}>
            <AvatarImage src={avatarUrl} alt={name} />
          </Avatar>
        )}
        <HeaderNameWrap>
          <HeaderName>{name}</HeaderName>
        </HeaderNameWrap>
      </HeaderLeft>

      <div style={{ position: "relative" }}>
        <SettingsButton
          type="button"
          aria-label="Chat settings"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Settings size={16} />
        </SettingsButton>
        {open && (
          <Dropdown>
            <div>
              <DropdownLabel>Chat theme</DropdownLabel>
              <ThemeButtons>
                <ThemeButton
                  type="button"
                  $variant="standard"
                  $active={theme === "standard"}
                  onClick={() => onThemeChange("standard")}
                >
                  Standard
                </ThemeButton>
                <ThemeButton
                  type="button"
                  $variant="love"
                  $active={theme === "love"}
                  onClick={() => onThemeChange("love")}
                >
                  Love
                </ThemeButton>
                <ThemeButton
                  type="button"
                  $variant="friends"
                  $active={theme === "friends"}
                  onClick={() => onThemeChange("friends")}
                >
                  Friends
                </ThemeButton>
              </ThemeButtons>
            </div>

            {type === "group" && otherParticipants.length > 0 && (
              <DropdownDivider>
                <DropdownLabel>
                  Participants ({otherParticipants.length + (currentUserId ? 1 : 0)})
                </DropdownLabel>
                <ParticipantsList>
                  {participants.map((p) => (
                    <ParticipantRow key={p.userId}>
                      <Avatar style={{ width: "1.5rem", height: "1.5rem" }}>
                        <AvatarImage
                          src={(p.avatarUrl as string | undefined) ?? undefined}
                          alt={p.displayName || p.username}
                        />
                      </Avatar>
                      <ParticipantName>
                        {p.displayName || p.username}
                        {p.userId === currentUserId ? " (You)" : ""}
                      </ParticipantName>
                    </ParticipantRow>
                  ))}
                </ParticipantsList>
              </DropdownDivider>
            )}

            <DropdownButton type="button" onClick={onToggleMute}>
              <span>{muted ? "Unmute this chat" : "Mute this chat"}</span>
              <BellOff
                size={16}
                style={{ color: muted ? "var(--destructive)" : "var(--muted-foreground)" }}
              />
            </DropdownButton>

            {type === "group" && onLeaveGroup && (
              <LeaveGroupButton
                type="button"
                onClick={() => {
                  if (!leavingGroup) onLeaveGroup();
                }}
              >
                <span>{leavingGroup ? "Leaving…" : "Leave group"}</span>
                <LogOut size={16} />
              </LeaveGroupButton>
            )}
          </Dropdown>
        )}
      </div>
    </HeaderRoot>
  );
}
