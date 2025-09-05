'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from './ui/separator';

interface AccountDialogProps {
  children: React.ReactNode;
}

export function AccountDialog({ children }: AccountDialogProps) {
  const user = {
    name: 'Aakash Kannan',
    email: 'aakashkannan@gmail.com',
    avatar: 'https://picsum.photos/id/433/100/100',
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
          <DialogDescription>
            Here are your current account details.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person face" />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right text-sm font-medium text-muted-foreground">Plan</span>
            <span className="col-span-3 font-semibold">Pro</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right text-sm font-medium text-muted-foreground">Member Since</span>
            <span className="col-span-3 font-semibold">January 2024</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
