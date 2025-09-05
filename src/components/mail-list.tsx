'use client';

import type { Email } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Flame, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface MailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
}

const priorityIcons = {
  high: <Flame className="size-4 text-red-500" />,
  medium: <ArrowUp className="size-4 text-yellow-500" />,
  low: <ArrowDown className="size-4 text-gray-500" />,
};

const sentimentColors = {
  positive: 'bg-primary',
  neutral: 'bg-secondary',
  negative: 'bg-destructive',
}

export default function MailList({ emails, selectedEmailId, onSelectEmail }: MailListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {emails.length > 0 ? (
          emails.map((email, index) => (
            <div
              key={email.id}
              role="button"
              className={cn(
                'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:bg-accent cursor-pointer animate-fade-in-down',
                selectedEmailId === email.id && 'bg-accent shadow-md'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onSelectEmail(email.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectEmail(email.id);
                }
              }}
              tabIndex={0}
            >
              <div className="flex w-full items-start">
                <div className="flex items-center gap-3 flex-1">
                   <Avatar className="h-8 w-8">
                      <AvatarImage src={email.avatar} alt={email.sender} data-ai-hint="person face" />
                      <AvatarFallback>
                        {email.sender.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{email.sender}</p>
                    <p className="text-xs text-muted-foreground truncate">{email.email}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                  {formatDistanceToNow(email.receivedAt, { addSuffix: true })}
                </div>
              </div>
              <div className="text-sm font-medium w-full truncate">{email.subject}</div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {email.body.substring(0, 300)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={email.status === 'resolved' ? 'secondary' : 'outline'}>{email.status}</Badge>
                <Tooltip>
                    <TooltipTrigger asChild>
                       <span tabIndex={0}>{priorityIcons[email.priority] || <Minus className="size-4 text-gray-400" />}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="capitalize">{email.priority} priority</p>
                    </TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                       <span tabIndex={0}><div className={cn("size-2.5 rounded-full", sentimentColors[email.sentiment])} /></span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="capitalize">{email.sentiment} sentiment</p>
                    </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground p-8">
            No emails found.
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
