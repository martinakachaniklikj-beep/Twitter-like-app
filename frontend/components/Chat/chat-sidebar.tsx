import {
  SidebarRoot,
  SidebarTitle,
  ChatItem,
  ChatItemName,
  ChatItemPreview,
} from "./chat-sidebar.styled";
import { CHAT_LABELS } from "./types";

export function ChatSidebar() {
  const chats = [
    { id: 1, name: "John", last: "Hey!" },
    { id: 2, name: "Anna", last: "See you later" },
  ];

  return (
    <SidebarRoot>
      <SidebarTitle>{CHAT_LABELS.messages}</SidebarTitle>
      {chats.map((chat) => (
        <ChatItem key={chat.id}>
          <ChatItemName>{chat.name}</ChatItemName>
          <ChatItemPreview>{chat.last}</ChatItemPreview>
        </ChatItem>
      ))}
    </SidebarRoot>
  );
}
