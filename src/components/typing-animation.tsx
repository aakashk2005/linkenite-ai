"use client";

import { cn } from "@/lib/utils";

export function TypingAnimation({
  text = "Bot is typing",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
      <span className="text-sm">{text}</span>
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-dot-pulse-before rounded-full bg-muted-foreground" />
        <span className="h-1.5 w-1.5 animate-dot-pulse rounded-full bg-muted-foreground" />
        <span className="h-1.5 w-1.5 animate-dot-pulse-after rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
}
