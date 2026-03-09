import { ChatSidebar } from "./chat-sidebar"
import { ChatContainer } from "./chat-container"

export function ChatLayout() {
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <ChatContainer />
    </div>
  )
}
