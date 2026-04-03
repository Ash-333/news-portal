'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Role } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/page-header'
import { useCreateUser } from '@/hooks/use-users'
import { usePermissions } from '@/hooks/use-permissions'
import { toast } from 'sonner'

const manageableRoles = [Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN] as const

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(manageableRoles),
})

type CreateUserFormData = z.infer<typeof createUserSchema>

const roleLabels: Record<Role, string> = {
  [Role.PUBLIC_USER]: 'Public User',
  [Role.AUTHOR]: 'Author',
  [Role.ADMIN]: 'Admin',
  [Role.SUPERADMIN]: 'SuperAdmin',
}

export default function CreateUserPage() {
  const router = useRouter()
  const createUser = useCreateUser()
  const { assignableRoles } = usePermissions()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: (assignableRoles[0] as CreateUserFormData['role'] | undefined) ?? Role.AUTHOR,
    },
  })

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await createUser.mutateAsync(data)
      toast.success('User created successfully')
      router.push('/admin/users')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create user'
      toast.error(message)
    }
  }

  if (assignableRoles.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Create User"
          description="You do not have permission to create new users."
          actions={
            <Button variant="outline" onClick={() => router.push('/admin/users')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          }
        />

        <Card className="max-w-lg">
          <CardContent className="pt-6">
            <EmptyState
              title="Permission Required"
              description="Ask an administrator with user-management access to create this account."
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create User"
        description="Add a new team member with direct account access"
        actions={
          <Button variant="outline" onClick={() => router.push('/admin/users')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        }
      />

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-lg">User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter user's full name"
                className="mt-1"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter user's email address"
                className="mt-1"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Set an initial password"
                className="mt-1"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                {...register('role')}
                className="w-full p-2 mt-1 border rounded-md bg-background"
              >
                {assignableRoles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </select>
              {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>}
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={createUser.isPending}>
                <UserPlus className="w-4 h-4 mr-2" />
                {createUser.isPending ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
