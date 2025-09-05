'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Email } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import MailList from './mail-list';
import MailDisplay from './mail-display';

interface MailViewProps {
  allEmails: Email[];
  onUpdateEmail: (email: Email) => void;
}

export default function MailView({ allEmails, onUpdateEmail }: MailViewProps) {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmails = useMemo(() => {
    return allEmails
      .filter(email => {
        if (filter === 'all') return true;
        return email.status === filter;
      })
      .filter(email => {
        if (searchTerm.trim() === '') return true;
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
          email.sender.toLowerCase().includes(lowercasedTerm) ||
          email.subject.toLowerCase().includes(lowercasedTerm) ||
          email.body.toLowerCase().includes(lowercasedTerm)
        );
      });
  }, [allEmails, filter, searchTerm]);

  const selectedEmail = useMemo(
    () => allEmails.find(e => e.id === selectedEmailId) || null,
    [allEmails, selectedEmailId]
  );
  
  useEffect(() => {
    if (filteredEmails.length > 0 && !filteredEmails.find(e => e.id === selectedEmailId)) {
      setSelectedEmailId(filteredEmails[0].id);
    } else if (filteredEmails.length === 0) {
      setSelectedEmailId(null);
    }
  }, [filteredEmails, selectedEmailId]);

  return (
    <div className="flex h-full bg-card">
      <div className="w-full md:w-[400px] border-r flex flex-col">
        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search mail..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs 
            defaultValue="all" 
            onValueChange={(value) => setFilter(value as 'all' | 'pending' | 'resolved')}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <MailList
          emails={filteredEmails}
          onSelectEmail={setSelectedEmailId}
          selectedEmailId={selectedEmailId}
        />
      </div>
      <div className="flex-1 hidden md:flex flex-col">
        <MailDisplay email={selectedEmail} onUpdateEmail={onUpdateEmail} />
      </div>
    </div>
  );
}
