'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, MoreHorizontal, Pencil, Trash2, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { PageHeader } from '@/components/ui/page-header'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

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
  _count: {
    votes: number
    options: number
  }
}

export default function PollsPage() {
  const router = useRouter()
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPolls = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/polls')
      const data = await response.json()
      if (data.success) {
        setPolls(data.data)
      }
    } catch (error) {
      console.error('Error fetching polls:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  const togglePollStatus = async (pollId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/polls/${pollId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      const data = await response.json()
      if (data.success) {
        setPolls(polls.map(p => 
          p.id === pollId ? { ...p, isActive: !currentStatus } : p
        ))
        toast.success(`Poll ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update poll status'
      toast.error(errorMessage)
    }
  }

  const deletePoll = async (pollId: string) => {
    if (!confirm('Are you sure you want to delete this poll?')) return
    
    try {
      const response = await fetch(`/api/admin/polls/${pollId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        setPolls(polls.filter(p => p.id !== pollId))
        toast.success('Poll deleted successfully')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete poll'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Polls"
        description="Create and manage polls for user engagement"
        actions={
          <Button onClick={() => router.push('/admin/polls/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Poll
          </Button>
        }
      />

      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : polls.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-slate-500">
            No polls found. Create your first poll to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {polls.map((poll) => (
            <Card key={poll.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{poll.questionEn}</h3>
                    <p className="text-sm text-slate-500">{poll.questionNe}</p>
                    <div className="flex gap-4 mt-2 text-xs text-slate-500">
                      <span>{poll._count.options} options</span>
                      <span>{poll._count.votes} votes</span>
                      {poll.expiresAt && (
                        <span>Expires: {new Date(poll.expiresAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Active</span>
                      <Switch
                        checked={poll.isActive}
                        onCheckedChange={() => togglePollStatus(poll.id, poll.isActive)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/polls/${poll.id}`)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/polls/${poll.id}/results`)}>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Results
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deletePoll(poll.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}