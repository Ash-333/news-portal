'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, Send, ImagePlus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/ui/page-header'
import { useCreatePhotoGallery, useUpdatePhotoGallery, usePhotoGallery } from '@/hooks/use-photo-galleries'
import { FeaturedImageSelector } from '@/components/featured-image-selector'
import { MediaLibraryModal } from '@/components/media-library-modal'
import type { Media } from '@/types'
import { toast } from 'sonner'

const photoGallerySchema = z.object({
  titleNe: z.string().min(1, 'Nepali title is required'),
  titleEn: z.string().min(1, 'English title is required'),
  excerptNe: z.string().max(500).optional().or(z.literal('')),
  excerptEn: z.string().max(500).optional().or(z.literal('')),
  coverImageId: z.string().uuid().optional().or(z.literal('')),
  photos: z.array(
    z.object({
      mediaId: z.string().uuid(),
      captionNe: z.string().optional(),
      captionEn: z.string().optional(),
      order: z.number().int().default(0),
    })
  ).min(1, 'At least one photo is required'),
})

type PhotoGalleryFormData = z.infer<typeof photoGallerySchema>

interface PhotoGalleryFormProps {
  galleryId?: string
  isEditing: boolean
}

export function PhotoGalleryForm({ galleryId, isEditing }: PhotoGalleryFormProps) {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('english')
  const [coverMedia, setCoverMedia] = useState<Media | null>(null)
  const [selectedPhotos, setSelectedPhotos] = useState<Media[]>([])
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false)

  const { data: existingGallery, isLoading: isLoadingGallery } = usePhotoGallery(galleryId || '')
  const createMutation = useCreatePhotoGallery()
  const updateMutation = useUpdatePhotoGallery()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PhotoGalleryFormData>({
    resolver: zodResolver(photoGallerySchema),
    defaultValues: {
      excerptNe: '',
      excerptEn: '',
      coverImageId: '',
      photos: [],
    },
  })

  // Load existing gallery data when editing
  useEffect(() => {
    if (existingGallery && isEditing) {
      setCoverMedia(existingGallery.coverImage || null)
      setSelectedPhotos(
        existingGallery.photos.map((p) => ({
          id: p.media.id,
          filename: p.media.filename,
          url: p.media.url,
          type: p.media.type,
          size: 0,
          uploadedBy: '',
          createdAt: new Date(),
        })) as Media[]
      )
      reset({
        titleNe: existingGallery.titleNe,
        titleEn: existingGallery.titleEn,
        excerptNe: existingGallery.excerptNe || '',
        excerptEn: existingGallery.excerptEn || '',
        coverImageId: existingGallery.coverImageId || '',
        isPublished: existingGallery.isPublished,
        photos: existingGallery.photos.map((p) => ({
          mediaId: p.mediaId,
          captionNe: p.captionNe || '',
          captionEn: p.captionEn || '',
          order: p.order,
        })),
      } as PhotoGalleryFormData)
    }
  }, [existingGallery, isEditing, reset])

  const handleCoverImageChange = useCallback((media: Media | null) => {
    setCoverMedia(media)
  }, [])

  const handleCoverImageIdChange = useCallback(() => {
    const id = coverMedia?.id || ''
    setValue('coverImageId', id, { shouldValidate: false })
  }, [coverMedia, setValue])

  useEffect(() => {
    handleCoverImageIdChange()
  }, [coverMedia])

  const onSubmit = async (data: PhotoGalleryFormData, publish: boolean = false) => {
    try {
      const payload = publish
        ? { ...data, isPublished: true }
        : { ...data, isPublished: false }

      if (isEditing && galleryId) {
        await updateMutation.mutateAsync({ id: galleryId, data: payload })
        toast.success(publish ? 'Photo gallery published successfully' : 'Photo gallery updated successfully')
      } else {
        await createMutation.mutateAsync(payload)
        toast.success(publish ? 'Photo gallery published successfully' : 'Photo gallery created successfully')
      }
      router.push('/admin/photo-galleries')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save photo gallery'
      toast.error(errorMessage)
    }
  }

  const handleAddPhotos = (media: Media[]) => {
    const newPhotos = media.map((m, index) => ({
      mediaId: m.id,
      captionNe: '',
      captionEn: '',
      order: selectedPhotos.length + index,
    }))
    setSelectedPhotos((prev) => [...prev, ...media])
    setValue('photos', [...watch('photos'), ...newPhotos])
  }

  const handleRemovePhoto = (index: number) => {
    const photoId = watch('photos')[index].mediaId
    setSelectedPhotos((prev) => prev.filter((p) => p.id !== photoId))
    const updatedPhotos = watch('photos').filter((_, i) => i !== index)
    setValue(
      'photos',
      updatedPhotos.map((p, idx) => ({ ...p, order: idx }))
    )
  }

  const handleMovePhoto = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    if (toIndex < 0 || toIndex >= selectedPhotos.length) return

    setSelectedPhotos((prev) => {
      const newArr = [...prev]
      const [moved] = newArr.splice(fromIndex, 1)
      newArr.splice(toIndex, 0, moved)
      return newArr
    })

    const photos = [...watch('photos')]
    const [movedPhoto] = photos.splice(fromIndex, 1)
    photos.splice(toIndex, 0, movedPhoto)
    setValue(
      'photos',
      photos.map((p, idx) => ({ ...p, order: idx }))
    )
  }

  if (isEditing && isLoadingGallery) {
    return <div className="p-8">Loading gallery...</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edit Photo Gallery' : 'New Photo Gallery'}
        description={isEditing ? 'Update photo gallery details' : 'Create a new photo gallery'}
        actions={
          <Button variant="outline" onClick={() => router.push('/admin/photo-galleries')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="grid gap-6 lg:grid-cols-3">
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
                      placeholder="Enter gallery title in English"
                      className="mt-1"
                    />
                    {errors.titleEn && (
                      <p className="text-sm text-red-600 mt-1">{errors.titleEn.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="excerptEn">Excerpt (English)</Label>
                    <textarea
                      id="excerptEn"
                      {...register('excerptEn')}
                      placeholder="Brief description of the gallery"
                      className="mt-1 block w-full rounded-md border bg-background p-2 text-sm"
                      rows={3}
                    />
                    {errors.excerptEn && (
                      <p className="text-sm text-red-600 mt-1">{errors.excerptEn.message}</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="nepali" className="space-y-4">
                  <div>
                    <Label htmlFor="titleNe">Title (Nepali)</Label>
                    <Input
                      id="titleNe"
                      {...register('titleNe')}
                      placeholder="Enter gallery title in Nepali"
                      className="mt-1"
                    />
                    {errors.titleNe && (
                      <p className="text-sm text-red-600 mt-1">{errors.titleNe.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="excerptNe">Excerpt (Nepali)</Label>
                    <textarea
                      id="excerptNe"
                      {...register('excerptNe')}
                      placeholder="Brief description of the gallery"
                      className="mt-1 block w-full rounded-md border bg-background p-2 text-sm"
                      rows={3}
                    />
                    {errors.excerptNe && (
                      <p className="text-sm text-red-600 mt-1">{errors.excerptNe.message}</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Photos Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Gallery Photos</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPhotosModalOpen(true)}
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                Add Photos
              </Button>
            </CardHeader>
            <CardContent>
              {selectedPhotos.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center">
                  <ImagePlus className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-sm text-slate-500">No photos added yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedPhotos.map((photo, index) => (
                    <div
                      key={`${photo.id}-${index}`}
                      className="flex items-center gap-4 p-3 border rounded-lg bg-slate-50 dark:bg-slate-900"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMovePhoto(index, 'up')}
                          disabled={index === 0}
                        >
                          ▲
                        </Button>
                        <GripVertical className="w-5 h-5 text-slate-400" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMovePhoto(index, 'down')}
                          disabled={index === selectedPhotos.length - 1}
                        >
                          ▼
                        </Button>
                      </div>
                      <img
                        src={photo.url}
                        alt=""
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">English Caption</Label>
                          <Input
                            {...register(`photos.${index}.captionEn`)}
                            placeholder="Caption (EN)"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Nepali Caption</Label>
                          <Input
                            {...register(`photos.${index}.captionNe`)}
                            placeholder="Caption (NE)"
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePhoto(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {errors.photos && (
                <p className="text-sm text-red-600 mt-2">{errors.photos.message}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="button"
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
                onClick={handleSubmit((data) => onSubmit(data, false))}
              >
                <Save className="w-4 h-4 mr-2" />
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSubmit((data) => onSubmit(data, true))}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                Publish Gallery
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <FeaturedImageSelector
                value={coverMedia}
                onChange={handleCoverImageChange}
              />
              <p className="text-xs text-slate-500 mt-2">
                Optional: Select a cover image for this gallery
              </p>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Media Library Modals */}
      <MediaLibraryModal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        multiSelect
        onMultiSelect={handleAddPhotos}
        selectedMediaIds={selectedPhotos.map((p) => p.id)}
      />
    </div>
  )
}
