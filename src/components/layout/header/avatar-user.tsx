import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/types/user';

export function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  return (
    <Avatar className="w-[38px] h-[38px] border-2 border-border-mid">
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className="bg-primary text-white text-[13px] font-bold">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}