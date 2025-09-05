'use client';

import type { Email } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Cell, Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

interface DashboardViewProps {
  emails: Email[];
}

export default function DashboardView({ emails }: DashboardViewProps) {
  const stats = useMemo(() => {
    const total = emails.length;
    const pending = emails.filter(e => e.status === 'pending').length;
    const resolved = emails.filter(e => e.status === 'resolved').length;

    const sentimentCounts = emails.reduce((acc, email) => {
      acc[email.sentiment] = (acc[email.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<Email['sentiment'], number>);

    const priorityCounts = emails.reduce((acc, email) => {
      acc[email.priority] = (acc[email.priority] || 0) + 1;
      return acc;
    }, {} as Record<Email['priority'], number>);

    const sentimentData = Object.entries(sentimentCounts).map(([name, value]) => ({ name, value }));
    const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));

    return { total, pending, resolved, sentimentData, priorityData };
  }, [emails]);

  const chartConfig = {
    value: {
      label: 'Emails',
    },
    positive: {
      label: 'Positive',
      color: 'hsl(var(--chart-1))',
    },
    negative: {
      label: 'Negative',
      color: 'hsl(var(--destructive))',
    },
    neutral: {
      label: 'Neutral',
      color: 'hsl(var(--muted))',
    },
     high: {
      label: 'High',
      color: 'hsl(var(--destructive))',
    },
    medium: {
      label: 'Medium',
      color: 'hsl(var(--chart-3))',
    },
    low: {
      label: 'Low',
      color: 'hsl(var(--muted))',
    },
  };


  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold animate-fade-in-down">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="animate-fade-in-down" style={{animationDelay: '0.1s'}}>
          <CardHeader>
            <CardTitle>Total Emails</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-down" style={{animationDelay: '0.2s'}}>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-down" style={{animationDelay: '0.3s'}}>
          <CardHeader>
            <CardTitle>Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.resolved}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="animate-fade-in-down" style={{animationDelay: '0.4s'}}>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.sentimentData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                  />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="value" radius={4}>
                    {stats.sentimentData.map((entry) => (
                      <Cell key={entry.name} fill={chartConfig[entry.name as keyof typeof chartConfig]?.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-down" style={{animationDelay: '0.5s'}}>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.priorityData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                   <CartesianGrid vertical={false} />
                   <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                  />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="value" radius={4}>
                    {stats.priorityData.map((entry) => (
                      <Cell key={entry.name} fill={chartConfig[entry.name as keyof typeof chartConfig]?.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
