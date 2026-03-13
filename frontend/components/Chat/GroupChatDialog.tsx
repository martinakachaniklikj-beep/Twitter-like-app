"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import SearchBar from "@/components/SearchBar/SearchBar";
import { followServices, type FollowUser } from "@/services/followServices";
import { chatServices, type Conversation } from "@/services/chatServices";
import type { GroupChatDialogProps } from "./types";
import {
  DialogBody,
  FieldGroup,
  Label,
  RowLabel,
  LabelMain,
  LabelHint,
  ErrorText,
  ParticipantsBox,
  ParticipantsBoxHeader,
  ParticipantsBoxTitle,
  ParticipantsBoxLoading,
  ParticipantsBoxError,
  ParticipantsBoxEmpty,
  ParticipantList,
  ParticipantListItem,
  ParticipantButton,
  ParticipantInfo,
  ParticipantDisplayName,
  ParticipantUsername,
  Checkbox,
} from "./GroupChatDialog.styled";

export function GroupChatDialog({ open, onOpenChange, onCreated }: GroupChatDialogProps) {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followersError, setFollowersError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchResults, setSearchResults] = useState<FollowUser[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setGroupName("");
      setFollowers([]);
      setFollowersError(null);
      setFollowersLoading(false);
      setSelectedIds(new Set());
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    if (!user) return;

    const loadFollowers = async () => {
      setFollowersLoading(true);
      setFollowersError(null);
      try {
        const token = await user.getIdToken();
        const list = await followServices.fetchFollowers(token);
        setFollowers(list);
      } catch (err: any) {
        setFollowersError(err?.message ?? "Failed to load followers");
      } finally {
        setFollowersLoading(false);
      }
    };

    void loadFollowers();
  }, [open, user]);

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allCandidates: FollowUser[] = [
    ...followers,
    ...searchResults.filter((u) => !followers.some((f) => f.id === u.id)),
  ];

  const createGroupMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not logged in");
      const token = await user.getIdToken();
      const memberUserIds = Array.from(selectedIds);
      if (memberUserIds.length === 0) {
        throw new Error("Add at least one participant");
      }
      const name = groupName.trim();
      if (!name) {
        throw new Error("Group name is required");
      }
      return chatServices.createGroup(token, memberUserIds, name);
    },
    onSuccess: (conversation) => {
      onCreated(conversation);
      onOpenChange(false);
    },
  });

  const isCreateDisabled =
    !groupName.trim() || selectedIds.size === 0 || createGroupMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ maxWidth: "32rem" }} showCloseButton>
        <DialogHeader>
          <DialogTitle>Create group chat</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <FieldGroup>
            <Label htmlFor="group-name">Group name</Label>
            <Input
              id="group-name"
              placeholder="e.g. Besties, Project squad"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <RowLabel>
              <LabelMain>Add participants</LabelMain>
              <LabelHint>{selectedIds.size} selected</LabelHint>
            </RowLabel>
            <SearchBar
              onUserSelect={(userResult) => {
                setSearchError(null);
                const asFollowUser: FollowUser = {
                  id: userResult.id,
                  username: userResult.username,
                  displayName: (userResult as { displayName?: string | null }).displayName ?? null,
                  avatarUrl: (userResult as { avatarUrl?: string | null }).avatarUrl ?? null,
                };
                setSearchResults((prev) => {
                  if (prev.some((u) => u.id === asFollowUser.id)) return prev;
                  return [asFollowUser, ...prev];
                });
                setSelectedIds((prev) => {
                  const next = new Set(prev);
                  next.add(userResult.id);
                  return next;
                });
              }}
            />
            {searchError && <ErrorText>{searchError}</ErrorText>}
          </FieldGroup>

          <ParticipantsBox>
            <ParticipantsBoxHeader>
              <ParticipantsBoxTitle>Your followers</ParticipantsBoxTitle>
              {followersLoading && <ParticipantsBoxLoading>Loading…</ParticipantsBoxLoading>}
            </ParticipantsBoxHeader>
            {followersError && (
              <ParticipantsBoxError>{followersError}</ParticipantsBoxError>
            )}
            {!followersLoading && allCandidates.length === 0 && (
              <ParticipantsBoxEmpty>No followers or search results yet.</ParticipantsBoxEmpty>
            )}
            {allCandidates.length > 0 && (
              <ParticipantList>
                {allCandidates.map((u) => {
                  const checked = selectedIds.has(u.id);
                  const name = u.displayName || u.username;
                  return (
                    <ParticipantListItem key={u.id}>
                      <ParticipantButton type="button" onClick={() => toggleSelected(u.id)}>
                        <Checkbox checked={checked} readOnly />
                        <Avatar style={{ width: "1.75rem", height: "1.75rem" }}>
                          <AvatarImage
                            src={(u.avatarUrl as string | undefined) ?? undefined}
                            alt={name}
                          />
                        </Avatar>
                        <ParticipantInfo>
                          <ParticipantDisplayName>{name}</ParticipantDisplayName>
                          <ParticipantUsername>@{u.username}</ParticipantUsername>
                        </ParticipantInfo>
                      </ParticipantButton>
                    </ParticipantListItem>
                  );
                })}
              </ParticipantList>
            )}
          </ParticipantsBox>

          {createGroupMutation.isError && (
            <ErrorText>
              {(createGroupMutation.error as Error)?.message ?? "Failed to create group"}
            </ErrorText>
          )}
        </DialogBody>

        <DialogFooter style={{ marginTop: "1rem" }}>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isCreateDisabled}
            onClick={() => createGroupMutation.mutate()}
          >
            {createGroupMutation.isPending ? "Creating…" : "Create group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

