'use client';

import { useState } from 'react';
import { Poll } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useVotePoll, markAsVoted } from '@/hooks/usePolls';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { BarChart3, CheckCircle2 } from 'lucide-react';

interface PollCardProps {
  poll: Poll;
  showResults?: boolean;
  className?: string;
}

export function PollCard({ poll, showResults = false, className }: PollCardProps) {
  const { isNepali, t } = useLanguage();
  const { isAuthenticated, isEmailVerified } = useAuth();
  const voteMutation = useVotePoll();

  // Check if user has voted either from poll data or localStorage
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(() => {
    // Check poll data first, then localStorage
    if (poll.hasVoted) return true;
    if (typeof window !== 'undefined') {
      const votedPolls = JSON.parse(localStorage.getItem('voted_polls') || '{}');
      return !!votedPolls[poll.id];
    }
    return false;
  });
  const [showResultsNow, setShowResultsNow] = useState(showResults || poll.hasVoted || hasVoted);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const question = isNepali ? poll.questionNe : poll.questionEn;

  const handleVote = async () => {
    if (!selectedOption) return;

    setErrorMessage(null);


    try {
      await voteMutation.mutateAsync({ pollId: poll.id, optionId: selectedOption });
      markAsVoted(poll.id, selectedOption);
      setHasVoted(true);
      setShowResultsNow(true);
    } catch (error: any) {
      // If already voted, show results with percentages
      const errorMsg = error?.message || error?.response?.data?.message || '';
      if (errorMsg.includes('already voted') || errorMsg.includes('You have already voted')) {
        markAsVoted(poll.id, selectedOption);
        setHasVoted(true);
        setShowResultsNow(true);
        setErrorMessage(null);
      } else {
        console.error('Failed to vote:', error);
      }
    }
  };

  const calculatePercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  const canVote = !hasVoted && !showResultsNow;

  return (
    <div className={cn('bg-white dark:bg-news-card-dark rounded-lg shadow-sm border border-news-border dark:border-news-border-dark p-4', className)}>
      <div className="flex items-start gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-news-red shrink-0 mt-0.5" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {question}
        </h3>
      </div>

      <div className="space-y-3">
        {poll.options.map((option) => {
          const percentage = option.percentage !== undefined
            ? option.percentage
            : calculatePercentage(option.voteCount);
          const isSelected = selectedOption === option.id;
          const isVotedOption = poll.votedOptionId === option.id;

          return (
            <div key={option.id} className="relative">
              {showResultsNow || hasVoted ? (
                // Show results
                <div className="relative">
                  <div
                    className={cn(
                      'h-10 rounded-md transition-all overflow-hidden',
                      isVotedOption
                        ? 'bg-news-red/20 dark:bg-news-red/30'
                        : 'bg-gray-100 dark:bg-gray-800'
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {isNepali ? option.textNe : option.textEn}
                      {isVotedOption && (
                        <CheckCircle2 className="inline-block w-4 h-4 ml-1 text-news-red" />
                      )}
                    </span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {percentage}%
                    </span>
                  </div>
                </div>
              ) : (
                // Show voting options
                <button
                  onClick={() => setSelectedOption(option.id)}
                  disabled={!canVote}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-md border transition-all',
                    isSelected
                      ? 'border-news-red bg-news-red/5 dark:bg-news-red/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                    !canVote && 'cursor-not-allowed opacity-60'
                  )}
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {isNepali ? option.textNe : option.textEn}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Vote button */}
      {canVote && selectedOption && (
        <button
          onClick={handleVote}
          disabled={voteMutation.isPending}
          className="mt-4 w-full py-2 px-4 bg-news-red text-white rounded-md hover:bg-news-red-dark transition-colors disabled:opacity-60"
        >
          {voteMutation.isPending ? t('common.loading') : t('polls.vote')}
        </button>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Footer with stats */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {poll.totalVotes} {t('polls.votes')}
        </span>
        {poll.expiresAt && new Date(poll.expiresAt) < new Date() && (
          <span className="text-xs text-red-500">
            {t('polls.expired')}
          </span>
        )}
      </div>
    </div>
  );
}

// Loading skeleton
export function PollCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white dark:bg-news-card-dark rounded-lg shadow-sm border border-news-border dark:border-news-border-dark p-4 animate-pulse', className)}>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="mt-4 h-10 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}