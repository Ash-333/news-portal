'use client';

import { usePolls } from '@/hooks/usePolls';
import { PollCard, PollCardSkeleton } from '@/components/polls/PollCard';
import { cn } from '@/lib/utils';

import { BarChart3 } from 'lucide-react';

interface PollSectionProps {
  className?: string;
}

export function PollSection({ className }: PollSectionProps) {

  const { data: polls, isLoading, error } = usePolls();

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <PollCardSkeleton />
      </div>
    );
  }

  if (error || !polls || polls.length === 0) {
    return null;
  }

  // Show only the latest non-expired poll, limit to 1
  const activePolls = polls.filter(p => {
    if (!p.expiresAt) return true;
    return new Date(p.expiresAt) > new Date();
  }).slice(0, 1);

  if (activePolls.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-news-red" />
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
          {'मतदान'}
        </h3>
      </div>

      <div className="space-y-4">
        {activePolls.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </div>
  );
}
