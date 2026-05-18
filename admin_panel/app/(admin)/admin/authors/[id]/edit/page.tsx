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

const authorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().default(''),
  image: z.string().default(''),
  email: z.string().email().or(z.literal('')).default(''),
  isActive: z.boolean().default(true),
})

type AuthorFormData = z.infer<typeof authorSchema>

interface Author extends AuthorFormData {
  id: string
  createdAt: string
}

export default function EditAuthorPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [author, setAuthor] = useState<Author | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [currentImage, setCurrentImage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      isActive: true,
    },
  })

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch(`/api/admin/authors/${id}`)
        const data = await response.json()
        if (data.success) {
          setAuthor(data.data)
          const sanitized = {
            name: data.data.name,
            email: data.data.email ?? '',
            bio: data.data.bio ?? '',
            image: data.data.image ?? '',
            isActive: data.data.isActive,
          }
          reset(sanitized)
          setCurrentImage(data.data.image || '')
          setPreview(data.data.image || '')
        } else {
          toast.error('Author not found')
          router.push('/admin/authors')
        }
      } catch (error) {
        console.error('Error fetching author:', error)
        toast.error('Failed to fetch author')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchAuthor()
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

  const onSubmit = async (data: AuthorFormData) => {
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

      const response = await fetch(`/api/admin/authors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          image: imageUrl,
        }),
      })
      const result = await response.json()
      
      if (result.success) {
        toast.success('Author updated successfully')
        router.push('/admin/authors')
      } else {
        toast.error(result.message || 'Failed to update author')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update author'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Edit Author"
          actions={
            <Button variant="outline" asChild>
              <Link href="/admin/authors">Back to Authors</Link>
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
        title="Edit Author"
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/authors">Back to Authors</Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Author Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label htmlFor="name">Name</Label>
                 <Input id="name" {...register('name')} placeholder="John Doe" />
                 {errors.name && (
                   <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                 )}
               </div>
            </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label htmlFor="email">Email</Label>
                 <Input id="email" {...register('email')} placeholder="author@email.com" type="email" />
                 {errors.email && (
                   <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                 )}
               </div>
             </div>

             <div>
               <Label htmlFor="bio">Bio</Label>
               <textarea
                 id="bio"
                 {...register('bio')}
                 placeholder="Author bio..."
                 className="w-full min-h-[100px] px-3 py-2 border rounded-md"
               />
             </div>

            <div>
              <Label>Photo</Label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              
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
              <Switch
                id="isActive"
                checked={watch('isActive')}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Updating...' : 'Update Author'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/admin/authors')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </>
  )
}
