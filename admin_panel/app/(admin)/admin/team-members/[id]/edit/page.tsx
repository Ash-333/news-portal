'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { PageHeader } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameNe: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  departmentNe: z.string().optional(),
  designation: z.string().min(1, 'Designation is required'),
  designationNe: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
})

type TeamMemberFormData = z.infer<typeof teamMemberSchema>

interface TeamMember extends TeamMemberFormData {
  id: string
  createdAt: string
}

export default function EditTeamMemberPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [member, setMember] = useState<TeamMember | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [currentImage, setCurrentImage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      isActive: true,
    },
  })

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(`/api/admin/team-members/${id}`)
        const data = await response.json()
        if (data.success) {
          setMember(data.data)
          reset(data.data)
          setCurrentImage(data.data.image || '')
          setPreview(data.data.image || '')
        } else {
          toast.error('Team member not found')
          router.push('/admin/team-members')
        }
      } catch (error) {
        console.error('Error fetching member:', error)
        toast.error('Failed to fetch team member')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchMember()
    }
  }, [id, reset, router])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setSelectedFile(null)
    setPreview('')
    setCurrentImage('')
    setValue('image', '')
  }

  const onSubmit = async (data: TeamMemberFormData) => {
    setIsSubmitting(true)
    try {
      let imageUrl = data.image || ''
      
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)

        const uploadResponse = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        })
        const uploadResult = await uploadResponse.json()

        if (uploadResult.success) {
          imageUrl = uploadResult.data.url
        } else {
          toast.error('Failed to upload image')
          setIsSubmitting(false)
          return
        }
      } else if (preview === '') {
        imageUrl = ''
      }

      const response = await fetch(`/api/admin/team-members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          image: imageUrl,
        }),
      })
      const result = await response.json()
      
      if (result.success) {
        toast.success('Team member updated successfully')
        router.push('/admin/team-members')
      } else {
        toast.error(result.message || 'Failed to update team member')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update team member'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Edit Team Member"
          actions={
            <Button variant="outline" asChild>
              <Link href="/admin/team-members">Back to Team Members</Link>
            </Button>
          }
        />
        <div className="space-y-4">
          <Skeleton className="h-96" />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Edit Team Member"
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/team-members">Back to Team Members</Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name (English)</Label>
                <Input id="name" {...register('name')} placeholder="John Doe" />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="nameNe">Name (Nepali)</Label>
                <Input id="nameNe" {...register('nameNe')} placeholder="जन डो" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department (English)</Label>
                <Input id="department" {...register('department')} placeholder="News" />
                {errors.department && (
                  <p className="text-sm text-red-600 mt-1">{errors.department.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="departmentNe">Department (Nepali)</Label>
                <Input id="departmentNe" {...register('departmentNe')} placeholder="समाचार" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="designation">Designation (English)</Label>
                <Input id="designation" {...register('designation')} placeholder="Editor" />
                {errors.designation && (
                  <p className="text-sm text-red-600 mt-1">{errors.designation.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="designationNe">Designation (Nepali)</Label>
                <Input id="designationNe" {...register('designationNe')} placeholder="सम्पादक" />
              </div>
            </div>

            <div>
              <Label>Photo</Label>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
              
              {preview ? (
                <div className="relative mt-2 w-32 h-32">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="mt-1 border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-gray-50 text-center" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload photo</p>
                  <p className="text-xs text-gray-400">Max 5MB</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Switch id="isActive" {...register('isActive')} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Updating...' : 'Update Member'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/admin/team-members')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </>
  )
}