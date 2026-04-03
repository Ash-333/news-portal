'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { toast } from 'sonner'

interface PollOption {
  id: string
  textNe: string
  textEn: string
  voteCount: number
  percentage: number
}

interface Poll {
  id: string
  questionNe: string
  questionEn: string
  description: string | null
  isActive: boolean
  isMultiple: boolean
  startsAt: string | null
  expiresAt: string | null
  createdAt: string
  totalVotes: number
  options: PollOption[]
}

export default function PollResultsPage() {
  const router = useRouter()
  const params = useParams()
  const pollId = params?.id as string || ''
  
  const [poll, setPoll] = useState<Poll | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/admin/polls/${pollId}`)
        const data = await response.json()
        if (data.success) {
          setPoll(data.data)
        } else {
          toast.error('Failed to load poll')
          router.push('/admin/polls')
        }
      } catch (error) {
        console.error('Error fetching poll:', error)
        toast.error('Failed to load poll')
      } finally {
        setIsLoading(false)
      }
    }

    if (pollId) {
      fetchPoll()
    }
  }, [pollId, router])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Poll Results"
          description="View voting results"
          actions={
            <Button variant="outline" onClick={() => router.push('/admin/polls')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Polls
            </Button>
          }
        />
        <div className="text-center py-10">Loading...</div>
      </div>
    )
  }

  if (!poll) {
    return null
  }

  const maxVotes = Math.max(...poll.options.map(o => o.voteCount), 1)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Poll Results"
        description="View voting results"
        actions={
          <Button variant="outline" onClick={() => router.push('/admin/polls')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Polls
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Poll Info */}
        <Card>
          <CardHeader>
            <CardTitle>Poll Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{poll.questionEn}</h3>
              <p className="text-slate-500">{poll.questionNe}</p>
            </div>
            
            {poll.description && (
              <p className="text-sm text-slate-600">{poll.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-sm text-slate-500">Total Votes</p>
                <p className="text-2xl font-bold">{poll.totalVotes}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Options</p>
                <p className="text-2xl font-bold">{poll.options.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <p className={`font-medium ${poll.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {poll.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Multiple Choice</p>
                <p className="font-medium">{poll.isMultiple ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {poll.expiresAt && (
              <div className="pt-4 border-t">
                <p className="text-sm text-slate-500">Expires: {new Date(poll.expiresAt).toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Voting Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {poll.options.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{option.textEn}</span>
                  <span className="text-slate-500">
                    {option.voteCount} votes ({option.percentage}%)
                  </span>
                </div>
                <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${option.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">{option.textNe}</p>
              </div>
            ))}

            {poll.totalVotes === 0 && (
              <p className="text-center text-slate-500 py-4">No votes yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}