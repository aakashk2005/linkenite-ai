export type Email = {
  id: string;
  sender: string;
  email: string;
  avatar: string;
  subject:string;
  body: string;
  receivedAt: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'resolved';
};
