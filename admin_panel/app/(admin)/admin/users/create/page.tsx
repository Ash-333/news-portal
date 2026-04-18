'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { ArrowLeft, UserPlus, Upload, Image as ImageIcon } from 'lucide-react'
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
import {
  Select,
} from '@/components/ui/select'

const manageableRoles = [Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN] as const

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  nameNe: z.string().optional(),
  bio: z.string().optional(),
  profilePhoto: z.string().optional(),
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
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: (assignableRoles[0] as CreateUserFormData['role'] | undefined) ?? Role.AUTHOR,
    },
  })

  const watchRole = watch('role')
  const profilePhoto = watch('profilePhoto')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()

      if (result.success) {
        setValue('profilePhoto', result.data.url)
        toast.success('Image uploaded successfully')
      } else {
        toast.error(result.message || 'Failed to upload image')
      }
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

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

  const currentRole = watchRole || assignableRoles[0]

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
              <Label htmlFor="name">Full Name (English) *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter user's full name"
                className="mt-1"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="nameNe">Full Name (Nepali)</Label>
              <Input
                id="nameNe"
                {...register('nameNe')}
                placeholder="उपयोगकर्ताको पूरा नाम"
                className="mt-1"
              />
              {errors.nameNe && <p className="text-sm text-red-600 mt-1">{errors.nameNe.message}</p>}
            </div>

            <div>
              <Label>Profile Photo</Label>
              <div className="mt-1 space-y-2">
                {profilePhoto ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                    <img
                      src={profilePhoto}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setValue('profilePhoto', '')}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : null}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    'Uploading...'
                  ) : profilePhoto ? (
                    'Change Photo'
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </Button>
              </div>
              {errors.profilePhoto && <p className="text-sm text-red-600 mt-1">{errors.profilePhoto.message}</p>}
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                {...register('bio')}
                placeholder="Short bio (optional)"
                className="mt-1 w-full p-2 border rounded-md bg-background text-sm min-h-[80px]"
              />
              {errors.bio && <p className="text-sm text-red-600 mt-1">{errors.bio.message}</p>}
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
              <Select
                options={assignableRoles.map((role) => ({ value: role, label: roleLabels[role] }))}
                value={currentRole}
                onChange={(value) => setValue('role', value as CreateUserFormData['role'])}
                placeholder="Select a role"
                className="mt-1"
              />
              {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>}
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={createUser.isPending || isUploading}
              >
                {isUploading ? (
                  'Uploading profile photo... please wait'
                ) : createUser.isPending ? (
                  'Creating...'
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
