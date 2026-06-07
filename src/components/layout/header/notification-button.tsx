import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export function NotificationButton() {
  return (
    <Button variant="outline" size="icon" className="relative w-9 h-9">
      <Bell className="h-[18px] w-[18px]" />
      <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full bg-danger border-2 border-white" />
    </Button>
  );
}