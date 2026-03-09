import { Avatar, AvatarImage } from "@/components/ui/avatar"

export function ChatHeader({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border p-4 flex-shrink-0">
      <Avatar>
        <AvatarImage src={avatarUrl} alt={name} />
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="font-semibold truncate">{name}</span>
      </div>
    </div>
  )
}
