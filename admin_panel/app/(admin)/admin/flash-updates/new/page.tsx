'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/ui/page-header'
import { TipTapEditor } from '@/components/tiptap-editor'
import { FeaturedImageSelector } from '@/components/featured-image-selector'
import { MediaLibraryModal } from '@/components/media-library-modal'
import type { Media } from '@/types'
import { toast } from 'sonner'
import { useCreateFlashUpdate } from '@/hooks/use-flash-updates'

const flashUpdateSchema = z.object({
  titleNe: z.string().min(1, 'Nepali title is required'),
  titleEn: z.string().min(1, 'English title is required'),
  contentNe: z.string().min(1, 'Nepali content is required'),
  contentEn: z.string().min(1, 'English content is required'),
  excerptNe: z.string().optional(),
  excerptEn: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featuredImageId: z.string().optional(),
})

type FlashUpdateFormData = z.infer<typeof flashUpdateSchema>

export default function NewFlashUpdatePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('english')
  const [featuredMedia, setFeaturedMedia] = useState<Media | null>(null)
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
  const [pendingImageInsert, setPendingImageInsert] = useState<((url: string) => void) | null>(null)
  const createFlashUpdate = useCreateFlashUpdate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FlashUpdateFormData>({
    resolver: zodResolver(flashUpdateSchema),
  })

  const contentEn = watch('contentEn') || ''
  const contentNe = watch('contentNe') || ''

  const onSubmit = async (data: FlashUpdateFormData) => {
    try {
      await createFlashUpdate.mutateAsync(data)
      toast.success('Flash update created successfully (expires in 24hrs)')
      router.push('/admin/flash-updates')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create flash update'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New 24hrs Update"
        description="Create a new flash update (auto-expires after 24 hours)"
        actions={
          <Button variant="outline" onClick={() => router.push('/admin/flash-updates')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="nepali">Nepali</TabsTrigger>
                </TabsList>

                <TabsContent value="english" className="space-y-4">
                  <div>
                    <Label htmlFor="titleEn">Title (English)</Label>
                    <Input
                      id="titleEn"
                      {...register('titleEn')}
                      placeholder="Enter update title in English"
                      className="mt-1"
                    />
                    {errors.titleEn && <p className="text-sm text-red-600 mt-1">{errors.titleEn.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="excerptEn">Excerpt (English)</Label>
                    <textarea
                      id="excerptEn"
                      {...register('excerptEn')}
                      placeholder="Brief summary"
                      className="mt-1 block w-full rounded-md border bg-background p-2 text-sm"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentEn">Content (English)</Label>
                    <div className="mt-1">
                      <TipTapEditor
                        value={contentEn}
                        onChange={(html) => setValue('contentEn', html, { shouldDirty: true })}
                        placeholder="Write your update content here..."
                        onRequestImageInsert={(insertFn) => {
                          setPendingImageInsert(() => insertFn)
                          setIsMediaLibraryOpen(true)
                        }}
                      />
                    </div>
                    {errors.contentEn && <p className="text-sm text-red-600 mt-1">{errors.contentEn.message}</p>}
                  </div>
                </TabsContent>

                <TabsContent value="nepali" className="space-y-4">
                  <div>
                    <Label htmlFor="titleNe">Title (Nepali)</Label>
                    <Input
                      id="titleNe"
                      {...register('titleNe')}
                      placeholder="Enter update title in Nepali"
                      className="mt-1"
                    />
                    {errors.titleNe && <p className="text-sm text-red-600 mt-1">{errors.titleNe.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="excerptNe">Excerpt (Nepali)</Label>
                    <textarea
                      id="excerptNe"
                      {...register('excerptNe')}
                      placeholder="Brief summary"
                      className="mt-1 block w-full rounded-md border bg-background p-2 text-sm"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentNe">Content (Nepali)</Label>
                    <div className="mt-1">
                      <TipTapEditor
                        value={contentNe}
                        onChange={(html) => setValue('contentNe', html, { shouldDirty: true })}
                        placeholder="Write your update content here..."
                        onRequestImageInsert={(insertFn) => {
                          setPendingImageInsert(() => insertFn)
                          setIsMediaLibraryOpen(true)
                        }}
                      />
                    </div>
                    {errors.contentNe && <p className="text-sm text-red-600 mt-1">{errors.contentNe.message}</p>}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Publish</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 mb-4">This update will be published immediately and expire after 24 hours.</p>
              <Button type="submit" className="w-full" disabled={createFlashUpdate.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {createFlashUpdate.isPending ? 'Publishing...' : 'Publish Update'}
              </Button>
            </CardContent>
          </Card>

          <FeaturedImageSelector
            value={featuredMedia}
            onChange={(media) => {
              setFeaturedMedia(media)
              setValue('featuredImageId', media?.id, { shouldDirty: true })
            }}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" {...register('metaTitle')} placeholder="SEO title" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <textarea
                  id="metaDescription"
                  {...register('metaDescription')}
                  placeholder="SEO description"
                  className="mt-1 block w-full rounded-md border bg-background p-2 text-sm"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      <MediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => { setIsMediaLibraryOpen(false); setPendingImageInsert(null) }}
        onSelect={(media) => {
          if (pendingImageInsert) pendingImageInsert(media.url)
          setPendingImageInsert(null)
          setIsMediaLibraryOpen(false)
        }}
      />
    </div>
  )
}
