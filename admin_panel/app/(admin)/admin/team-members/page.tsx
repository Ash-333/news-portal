'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface TeamMember {
  id: string
  name: string
  nameNe: string
  department: string
  departmentNe: string
  designation: string
  designationNe: string
  image: string
  bio: string
  bioNe: string
  email: string
  phone: string
  order: number
  isActive: boolean
  createdAt: string
}

export default function TeamMembersPage() {
  const router = useRouter()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/team-members')
      const data = await response.json()
      if (data.success) {
        setMembers(data.data)
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const toggleMemberStatus = async (memberId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/team-members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      const data = await response.json()
      if (data.success) {
        setMembers(members.map(m => 
          m.id === memberId ? { ...m, isActive: !currentStatus } : m
        ))
        toast.success(`Member ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status'
      toast.error(errorMessage)
    }
  }

  const deleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    try {
      const response = await fetch(`/api/admin/team-members/${memberId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        setMembers(members.filter(m => m.id !== memberId))
        toast.success('Team member deleted successfully')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete'
      toast.error(errorMessage)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <Button onClick={() => router.push('/admin/team-members/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Team Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-500 py-4">Loading...</p>
          ) : members.length === 0 ? (
            <p className="text-gray-500 py-4">No team members found. Add your first team member.</p>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                          <span className="text-xl">{member.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-500">
                        {member.designation} - {member.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={member.isActive}
                      onCheckedChange={() => toggleMemberStatus(member.id, member.isActive)}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/team-members/${member.id}/edit`)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteMember(member.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}