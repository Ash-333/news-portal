'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Edit, UserX, UserCheck, Trash2 } from 'lucide-react'
import { Role, UserStatus } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import { RoleBadge } from '@/components/ui/role-badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable, Column } from '@/components/ui/data-table'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { SkeletonTable } from '@/components/ui/skeleton-table'
import { useUsers, useUpdateUserStatus, useDeleteUser } from '@/hooks/use-users'
import { usePermissions } from '@/hooks/use-permissions'
import { permissions } from '@/lib/permissions'
import { User } from '@/types'
import { toast } from 'sonner'

const roleFilters = [
  { key: 'ALL', label: 'All' },
  { key: 'PUBLIC_USER', label: 'Users' },
  { key: 'AUTHOR', label: 'Authors' },
  { key: 'ADMIN', label: 'Admins' },
  { key: 'SUPERADMIN', label: 'SuperAdmins' },
]

export default function UsersPage() {
  const router = useRouter()
  const [activeRole, setActiveRole] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [actionUser, setActionUser] = useState<{ id: string; action: 'suspend' | 'activate' | 'delete' } | null>(null)
  const { hasPermission } = usePermissions()
  
  const role = activeRole === 'ALL' ? undefined : activeRole as Role
  const { data, isLoading, refetch } = useUsers({ 
    role, 
    search: searchQuery || undefined 
  })
  const updateStatus = useUpdateUserStatus()
  const deleteUser = useDeleteUser()

  const handleStatusChange = async () => {
    if (!actionUser) return
    
    try {
      if (actionUser.action === 'delete') {
        await deleteUser.mutateAsync(actionUser.id)
        toast.success('User deleted successfully')
      } else {
        await updateStatus.mutateAsync({
          id: actionUser.id,
          status: actionUser.action === 'suspend' ? UserStatus.SUSPENDED : UserStatus.ACTIVE,
        })
        toast.success(`User ${actionUser.action === 'suspend' ? 'suspended' : 'activated'} successfully`)
      }
      setActionUser(null)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to perform action'
      toast.error(errorMessage)
    }
  }

  const columns: Column<User>[] = [
    {
      key: 'user',
      header: 'User',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => <RoleBadge role={user.role as Role} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => <StatusBadge status={user.status as UserStatus} />,
    },
    {
      key: 'joined',
      header: 'Joined',
      render: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (user) => user.lastLoginAt 
        ? new Date(user.lastLoginAt).toLocaleDateString() 
        : 'Never',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/admin/users/${user.id}`)
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          {user.status === UserStatus.ACTIVE ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                setActionUser({ id: user.id, action: 'suspend' })
              }}
            >
              <UserX className="w-4 h-4 text-amber-600" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                setActionUser({ id: user.id, action: 'activate' })
              }}
            >
              <UserCheck className="w-4 h-4 text-green-600" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setActionUser({ id: user.id, action: 'delete' })
            }}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage system users"
        actions={hasPermission(permissions.usersCreate) ? (
          <Button onClick={() => router.push('/admin/users/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        ) : null}
      />

      {/* Role Filters */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {roleFilters.map((filter) => (
          <Button
            key={filter.key}
            variant={activeRole === filter.key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveRole(filter.key)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <SkeletonTable rows={5} cols={6} />
          ) : data?.data.length === 0 ? (
            <EmptyState
              title="No users found"
              description="Get started by inviting your first user."
              action={hasPermission(permissions.usersCreate) ? {
                label: 'Create User',
                onClick: () => router.push('/admin/users/create'),
              } : undefined}
            />
          ) : (
            <DataTable
              columns={columns}
              data={data?.data || []}
              keyExtractor={(user) => user.id}
              onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
            />
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation */}
      <ConfirmDialog
        isOpen={!!actionUser}
        onClose={() => setActionUser(null)}
        onConfirm={handleStatusChange}
        title={
          actionUser?.action === 'delete' 
            ? 'Delete User' 
            : actionUser?.action === 'suspend' 
              ? 'Suspend User' 
              : 'Activate User'
        }
        description={
          actionUser?.action === 'delete'
            ? 'Are you sure you want to delete this user? This action cannot be undone.'
            : actionUser?.action === 'suspend'
              ? 'Are you sure you want to suspend this user? They will not be able to access the system.'
              : 'Are you sure you want to activate this user?'
        }
        confirmText={actionUser?.action === 'delete' ? 'Delete' : actionUser?.action === 'suspend' ? 'Suspend' : 'Activate'}
        variant={actionUser?.action === 'delete' ? 'danger' : 'warning'}
        isLoading={updateStatus.isPending || deleteUser.isPending}
      />
    </div>
  )
}
