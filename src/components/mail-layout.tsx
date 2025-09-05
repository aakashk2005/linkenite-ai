'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Mail, BarChartHorizontal, User, Mailbox } from 'lucide-react';
import React, { useState, useEffect, Suspense } from 'react';
import type { Email } from '@/lib/types';
import { mockEmails } from '@/lib/data';
import MailView from './mail-view';
import DashboardView from './dashboard-view';
import { useIsMobile } from '@/hooks/use-mobile';
import { AccountDialog } from './account-dialog';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';

export default function MailLayout() {
  const [activeView, setActiveView] = useState<'inbox' | 'dashboard'>('inbox');
  const [emails, setEmails] = useState<Email[]>([]);
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setEmails(mockEmails);
  }, []);
  
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleUpdateEmail = (updatedEmail: Email) => {
    setEmails(prevEmails =>
      prevEmails.map(email =>
        email.id === updatedEmail.id ? updatedEmail : email
      )
    );
  };

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setSidebarOpen}>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-lg text-primary-foreground">
              <Mailbox className="size-6" />
            </div>
            <span className="font-bold text-xl">MailMuse</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('inbox')}
                isActive={activeView === 'inbox'}
                tooltip="Inbox"
              >
                <Mail />
                Inbox
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('dashboard')}
                isActive={activeView === 'dashboard'}
                tooltip="Dashboard"
              >
                <BarChartHorizontal />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                  <AccountDialog>
                    <SidebarMenuButton tooltip="Account">
                        <User />
                        Account
                    </SidebarMenuButton>
                  </AccountDialog>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="max-h-screen overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {activeView === 'inbox' ? (
            <MailView allEmails={emails} onUpdateEmail={handleUpdateEmail} />
          ) : (
            <DashboardView emails={emails} />
          )}
        </div>
        <footer className="p-4 text-center text-xs text-muted-foreground border-t">
          Built by <a href="https://github.com/aakashkannan-131" className="font-semibold hover:underline" target="_blank" rel="noopener noreferrer">Aakash Kannan</a>. © {new Date().getFullYear()} MailMuse. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
