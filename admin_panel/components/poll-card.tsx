'use client'

import { useState } from 'react'
import { usePublicPoll, useVotePoll } from '@/hooks/use-polls'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function PollCard({ pollId }: { pollId: string }) {
  const { data: poll, isLoading, error } = usePublicPoll(pollId)
  const voteMutation = useVotePoll()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-slate-500">
          Loading poll...
        </CardContent>
      </Card>
    )
  }

  if (error || !poll) {
    return null
  }

  const question = poll.question
  const description = poll.description
  const isMultiple = poll.isMultiple

  const handleVote = async () => {
    if (!selectedOption) return
    
    try {
      await voteMutation.mutateAsync({ pollId, optionId: selectedOption })
      setHasVoted(true)
    } catch (err) {
      console.error('Vote failed:', err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{question}</CardTitle>
        {description && (
          <p className="text-sm text-slate-500">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {poll.options.map((option) => {
          const text = option.text
          
          return (
            <div
              key={option.id}
              className={cn(
                'relative rounded-lg border p-3 cursor-pointer transition-all',
                hasVoted 
                  ? 'border-slate-200 bg-slate-50' 
                  : selectedOption === option.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-200 hover:border-slate-300'
              )}
              onClick={() => !hasVoted && setSelectedOption(option.id)}
            >
              {hasVoted && (
                <div 
                  className="absolute inset-0 bg-blue-100/50 rounded-lg transition-all"
                  style={{ width: `${option.percentage}%` }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <span className="font-medium">{text}</span>
                <div className="flex items-center gap-2">
                  {hasVoted && (
                    <span className="text-sm font-semibold text-blue-600">
                      {option.percentage}%
                    </span>
                  )}
                  {hasVoted && (
                    <span className="text-xs text-slate-500">
                      ({option.voteCount})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        <div className="pt-2 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            {poll.totalVotes} मतदान
          </span>
          
          {!hasVoted && (
            <Button 
              onClick={handleVote} 
              disabled={!selectedOption || voteMutation.isPending}
            >
              {voteMutation.isPending 
                ? 'मतदान हुँदै...'
                : 'मतदान गर्नुहोस्'
              }
            </Button>
          )}
          
          {hasVoted && (
            <span className="text-sm text-green-600 font-medium">
              मतदानको लागि धन्यवाद!
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}