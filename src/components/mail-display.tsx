'use client';

import type { Email } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import {
  Archive,
  CheckCircle,
  Clock,
  Loader2,
  Mail,
  Reply,
  Sparkles,
  MoreVertical,
  Trash2,
  Send,
} from 'lucide-react';
import React from 'react';
import { summarizeAction, generateReplyAction } from '@/app/actions';
import { Textarea } from './ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { TypingAnimation } from './typing-animation';

interface MailDisplayProps {
  email: Email | null;
  onUpdateEmail: (email: Email) => void;
}

export default function MailDisplay({ email, onUpdateEmail }: MailDisplayProps) {
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = React.useState(false);
  const [draft, setDraft] = React.useState<string | null>(null);
  const [isDraftLoading, setIsDraftLoading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setSummary(null);
    setDraft(null);
    setIsSummaryLoading(false);
    setIsDraftLoading(false);
  }, [email]);

  const handleSummarize = async () => {
    if (!email) return;
    setIsSummaryLoading(true);
    setSummary(null);
    try {
      const result = await summarizeAction(email.body);
      setSummary(result);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to generate summary. Please try again.',
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleGenerateReply = async () => {
    if (!email) return;
    setIsDraftLoading(true);
    setDraft(null);
    try {
      const result = await generateReplyAction(email.body);
      setDraft(result);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to generate draft reply. Please try again.',
      });
    } finally {
      setIsDraftLoading(false);
    }
  };

  const handleSendReply = () => {
    if (!email) return;
    toast({
      title: 'Mail Sent!',
      description: `Your reply to ${email.sender} has been sent.`,
    });
    setDraft(null);
  };

  const toggleStatus = () => {
    if (!email) return;
    const newStatus = email.status === 'pending' ? 'resolved' : 'pending';
    onUpdateEmail({ ...email, status: newStatus });
  };

  if (!email) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-muted-foreground animate-fade-in">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12" />
          <h2 className="mt-4 text-lg font-medium">No email selected</h2>
          <p className="mt-1 text-sm">
            Select an email from the list to read it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col animate-slide-in-from-right">
      <div className="flex items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleStatus}>
            {email.status === 'pending' ? <CheckCircle /> : <Clock />}
            <span className="sr-only">
              Mark as {email.status === 'pending' ? 'Resolved' : 'Pending'}
            </span>
          </Button>
          <Button variant="ghost" size="icon">
            <Archive />
            <span className="sr-only">Archive</span>
          </Button>
          <Button variant="ghost" size="icon" >
            <Trash2 />
            <span className="sr-only">Move to trash</span>
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Star thread</DropdownMenuItem>
              <DropdownMenuItem>Mute thread</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 text-sm">
            <Avatar>
              <AvatarImage alt={email.sender} src={email.avatar} data-ai-hint="person face" />
              <AvatarFallback>
                {email.sender.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="font-semibold">{email.sender}</p>
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {email.email}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            {format(email.receivedAt, 'PPpp')}
          </div>
        </div>
        <Separator className="my-4" />
        <h1 className="text-2xl font-bold mb-4">{email.subject}</h1>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div
            className="prose max-w-none text-foreground text-base"
            dangerouslySetInnerHTML={{ __html: email.body.replace(/\n/g, '<br />') }}
          />
        </div>
        <Separator className="my-6" />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-accent-foreground" />
                <span>AI Summary</span>
              </CardTitle>
              <CardDescription>
                A quick summary of the email content generated by AI.
              </CardDescription>
            </CardHeader>
            {(isSummaryLoading || summary) && (
              <CardContent>
                {isSummaryLoading ? (
                  <TypingAnimation text="Generating summary..." />
                ) : (
                  <p className="text-sm">{summary}</p>
                )}
              </CardContent>
            )}
            <CardFooter>
              <Button onClick={handleSummarize} disabled={isSummaryLoading} className="hover:shadow-md transition-shadow">
                {isSummaryLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  'Summarize Email'
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Reply className="text-accent-foreground" />
                <span>Smart Reply</span>
              </CardTitle>
              <CardDescription>
                Your AI-generated draft reply.
              </CardDescription>
            </CardHeader>
            {(isDraftLoading || draft) && (
              <CardContent>
                {isDraftLoading ? (
                  <TypingAnimation text="Generating draft..." />
                ) : (
                  <Textarea
                    value={draft!}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={5}
                    placeholder="AI-generated draft"
                  />
                )}
              </CardContent>
            )}
            <CardFooter className="flex gap-2">
              <Button onClick={handleGenerateReply} disabled={isDraftLoading} className="hover:shadow-md transition-shadow">
                {isDraftLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Draft'
                )}
              </Button>
              {draft && (
                <Button onClick={handleSendReply} className="hover:shadow-md transition-shadow">
                  <Send className="mr-2 h-4 w-4" />
                  Send Reply
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
