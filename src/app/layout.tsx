import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'MailMuse',
  description: 'AI-powered Email Assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ptSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
