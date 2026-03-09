export function ChatSidebar() {
    const chats = [
      { id: 1, name: "John", last: "Hey!" },
      { id: 2, name: "Anna", last: "See you later" },
    ] //placeholder for now
  
    return (
      <div className="w-80 border-r">
        <div className="p-4 font-bold text-lg">
          Messages
        </div>
  
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="p-4 hover:bg-muted cursor-pointer"
          >
            <div className="font-medium">{chat.name}</div>
            <div className="text-sm text-muted-foreground">
              {chat.last}
            </div>
          </div>
        ))}
      </div>
    )
  }
  