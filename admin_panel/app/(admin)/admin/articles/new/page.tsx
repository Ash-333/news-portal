'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { PageHeader } from '@/components/ui/page-header'
import { useCategories } from '@/hooks/use-categories'
import { useTags } from '@/hooks/use-tags'
import { useCreateArticle } from '@/hooks/use-articles'
import { TipTapEditor } from '@/components/tiptap-editor'
import { FeaturedImageSelector } from '@/components/featured-image-selector'
import { MediaLibraryModal } from '@/components/media-library-modal'
import { Select } from '@/components/ui/select'
import type { Media } from '@/types'
import { toast } from 'sonner'

const articleSchema = z.object({
  titleNe: z.string().min(1, 'Nepali title is required'),
  titleEn: z.string().min(1, 'English title is required'),
  contentNe: z.string().min(1, 'Nepali content is required'),
  contentEn: z.string().min(1, 'English content is required'),
  excerptNe: z.string().optional(),
  excerptEn: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  tagIds: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isBreaking: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  featuredImageId: z.string().optional(),
  scheduledAt: z.string().optional(),
})

type ArticleFormData = z.infer<typeof articleSchema>

export default function NewArticlePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('english')
  const [featuredMedia, setFeaturedMedia] = useState<Media | null>(null)
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
  const [pendingImageInsert, setPendingImageInsert] = useState<((url: string) => void) | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const { data: categories } = useCategories()
  const { data: tags } = useTags()
  const createArticle = useCreateArticle()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      isBreaking: false,
      isFeatured: false,
    },
  })

  const isBreaking = watch('isBreaking')
  const isFeatured = watch('isFeatured')
  const contentEn = watch('contentEn') || ''
  const contentNe = watch('contentNe') || ''

  const onSubmit = async (data: ArticleFormData) => {
    try {
      const articleData = { ...data, tagIds: selectedTags }
      await createArticle.mutateAsync(articleData)
      toast.success('Article created successfully')
      router.push('/admin/articles')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create article'
      toast.error(errorMessage)
    }
  }

  const onSubmitForReview = async (data: ArticleFormData) => {
    try {
      const articleData = { ...data, tagIds: selectedTags }
      await createArticle.mutateAsync(articleData)
      // Then submit for review
      toast.success('Article created and submitted for review')
      router.push('/admin/articles')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create article'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Article"
        description="Create a new article"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/admin/articles')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
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
                      placeholder="Enter article title in English"
                      className="mt-1"
                    />
                    {errors.titleEn && (
                      <p className="text-sm text-red-600 mt-1">{errors.titleEn.message}</p>
                    )}
                  </div>

                  {/* Tags - English */}
                  <div>
                    <Label>Tags</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {/* Selected tags - red badges with X */}
                      {selectedTags.map((tagId) => {
                        const tag = tags?.find((t) => t.id === tagId)
                        return tag ? (
                          <span
                            key={tag.id}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm rounded-full"
                          >
                            {tag.nameEn}
                            <button
                              type="button"
                              onClick={() => setSelectedTags(selectedTags.filter((id) => id !== tag.id))}
                              className="text-white hover:text-red-200 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ) : null
                      })}
                      {/* Available tags */}
                      {selectedTags.length > 0 && <span className="text-sm text-gray-400 my-auto">+</span>}
                      {tags?.map((tag) => {
                        if (selectedTags.includes(tag.id)) return null
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => setSelectedTags([...selectedTags, tag.id])}
                            className="px-2 py-1 text-sm rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                          >
                            + {tag.nameEn}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="excerptEn">Excerpt (English)</Label>
                    <textarea
                      id="excerptEn"
                      {...register('excerptEn')}
                      placeholder="Brief summary of the article"
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
                        placeholder="Write your article content here..."
                        onRequestImageInsert={(insertFn) => {
                          setPendingImageInsert(() => insertFn)
                          setIsMediaLibraryOpen(true)
                        }}
                      />
                    </div>
                    {errors.contentEn && (
                      <p className="text-sm text-red-600 mt-1">{errors.contentEn.message}</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="nepali" className="space-y-4">
                  <div>
                    <Label htmlFor="titleNe">Title (Nepali)</Label>
                    <Input
                      id="titleNe"
                      {...register('titleNe')}
                      placeholder="Enter article title in Nepali"
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
                      placeholder="Brief summary of the article"
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
                        placeholder="Write your article content here..."
                        onRequestImageInsert={(insertFn) => {
                          setPendingImageInsert(() => insertFn)
                          setIsMediaLibraryOpen(true)
                        }}
                      />
                    </div>
                    {errors.contentNe && (
                      <p className="text-sm text-red-600 mt-1">{errors.contentNe.message}</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Publish Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={createArticle.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSubmit(onSubmitForReview)}
                disabled={createArticle.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit for Review
              </Button>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                options={categories?.map((c) => ({ value: c.id, label: c.nameEn })) || []}
                value={watch('categoryId') || ''}
                onChange={(val) => setValue('categoryId', val)}
                placeholder="Select category"
              />
              {errors.categoryId && (
                <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Article Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isBreaking">Breaking News</Label>
                <Switch
                  id="isBreaking"
                  checked={isBreaking}
                  onCheckedChange={(checked) => setValue('isBreaking', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Featured Article</Label>
                <Switch
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => setValue('isFeatured', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Schedule Publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="scheduledAt">Scheduled Date & Time</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  {...register('scheduledAt')}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Leave empty to publish immediately or save as draft
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <FeaturedImageSelector
            value={featuredMedia}
            onChange={(media) => {
              setFeaturedMedia(media)
              setValue('featuredImageId', media?.id, { shouldDirty: true })
            }}
          />

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  {...register('metaTitle')}
                  placeholder="SEO title"
                  className="mt-1"
                />
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
        onClose={() => {
          setIsMediaLibraryOpen(false)
          setPendingImageInsert(null)
        }}
        onSelect={(media) => {
          if (pendingImageInsert) {
            pendingImageInsert(media.url)
          }
          setPendingImageInsert(null)
          setIsMediaLibraryOpen(false)
        }}
      />
    </div>
  )
}
