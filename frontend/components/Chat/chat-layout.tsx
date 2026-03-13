import { ChatSidebar } from './chat-sidebar';
import { ChatContainer } from './chat-container';
import { LayoutRoot } from './chat-layout.styled';

export function ChatLayout() {
  return (
    <LayoutRoot>
      <ChatSidebar />
      <ChatContainer />
    </LayoutRoot>
  );
}
