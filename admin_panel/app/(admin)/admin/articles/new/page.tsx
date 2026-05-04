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
import { Switch } from '@/components/ui/switch'
import { PageHeader } from '@/components/ui/page-header'
import { useCategories } from '@/hooks/use-categories'
import { useTags } from '@/hooks/use-tags'
import { useCreateArticle } from '@/hooks/use-articles'
import { TipTapEditor } from '@/components/tiptap-editor'
import { FeaturedImageSelector } from '@/components/featured-image-selector'
import { MediaLibraryModal } from '@/components/media-library-modal'
import { Select } from '@/components/ui/select'
import type { Media, CategoryWithChildren } from '@/types'
import { toast } from 'sonner'
import AuthorSelect from '@/components/author-select'
import { articleSchema } from '@/lib/validations'
import type { ArticleFormData } from '@/lib/validations'

export default function NewArticlePage() {
  const router = useRouter()
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
        isFlashUpdate: false,
        isFeatured: false,
        isTitleOnly: false,
        authorId: '',
      },
   })

  const isFlashUpdate = watch('isFlashUpdate')
  const isFeatured = watch('isFeatured')
  const isTitleOnly = watch('isTitleOnly')
  const content = watch('content') || ''

  // Get top-level categories only
  const topLevelCategories = categories?.filter(cat => !cat.parentId) || []

  // Get subcategories for selected category
  const selectedCategoryId = watch('categoryId')
  const selectedCategory = categories?.find(cat => cat.id === selectedCategoryId)
  const subcategories = selectedCategory?.children || []

  const onSubmit = async (data: ArticleFormData) => {
    try {
      // Use subcategoryId if selected, otherwise categoryId
      const finalCategoryId = data.subcategoryId || data.categoryId
      const articleData = { ...data, categoryId: finalCategoryId, tagIds: selectedTags }
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
      // Use subcategoryId if selected, otherwise categoryId
      const finalCategoryId = data.subcategoryId || data.categoryId
      const articleData = { ...data, categoryId: finalCategoryId, tagIds: selectedTags }
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
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Enter article title"
                  className="mt-1"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="subheading">Subheading</Label>
                <Input
                  id="subheading"
                  {...register('subheading')}
                  placeholder="Enter subheading (optional)"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <textarea
                  id="excerpt"
                  {...register('excerpt')}
                  placeholder="Brief summary of the article"
                  className="mt-1 block w-full rounded-md border bg-background p-2 text-sm"
                  rows={3}
                />
                </div>
               
           <div className="space-y-4">
             <h4 className="text-sm font-medium text-muted-foreground">SEO Settings</h4>
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
           </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <div className="mt-1">
                  <TipTapEditor
                    value={content}
                    onChange={(html) => setValue('content', html, { shouldDirty: true })}
                    placeholder="Write your article content here..."
                    onRequestImageInsert={(insertFn) => {
                      setPendingImageInsert(() => insertFn)
                      setIsMediaLibraryOpen(true)
                    }}
                  />
                </div>
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
              )}
            </div>
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

          {/* Author */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Author</CardTitle>
            </CardHeader>
            <CardContent>
              <AuthorSelect
                value={watch('authorId') || ''}
                onValueChange={(val) => setValue('authorId', val, { shouldDirty: true })}
                error={errors.authorId?.message}
              />
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Main Category</Label>
                  <Select
                    options={topLevelCategories.map((c) => ({ value: c.id, label: c.name }))}
                    value={watch('categoryId') || ''}
                    onChange={(val) => {
                      setValue('categoryId', val)
                      // Clear subcategory when main category changes
                      setValue('subcategoryId', '')
                    }}
                    placeholder="Select main category"
                  />
                  {errors.categoryId && (
                    <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
                  )}
                </div>

                {subcategories.length > 0 && (
                  <div>
                    <Label>Subcategory</Label>
                    <Select
                      options={subcategories.map((c) => ({ value: c.id, label: c.name }))}
                      value={watch('subcategoryId') || ''}
                      onChange={(val) => setValue('subcategoryId', val)}
                      placeholder="Select subcategory (optional)"
                    />
                  </div>
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
                <Label htmlFor="isFlashUpdate">Flash Update</Label>
                <Switch
                  id="isFlashUpdate"
                  checked={isFlashUpdate}
                  onCheckedChange={(checked) => setValue('isFlashUpdate', checked)}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="isTitleOnly">Title Only (Featured)</Label>
                <Switch
                  id="isTitleOnly"
                  checked={isTitleOnly}
                  onCheckedChange={(checked) => setValue('isTitleOnly', checked)}
                  disabled={!isFeatured}
                />
              </div>
            </CardContent>
          </Card>

          {/* Published Date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Publication Date</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="publishedAt">Published Date & Time</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  {...register('publishedAt')}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Set custom publish date or leave empty (will auto-set when published)
                </p>
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

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {/* Selected tags - red badges with X */}
                 {selectedTags.map((tagId) => {
                   const tag = tags?.find((t) => t.id === tagId)
                   return tag ? (
                     <span
                       key={tag.id}
                       className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm rounded-full"
                     >
                       {tag.name}
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
                       + {tag.name}
                     </button>
                   )
                 })}
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
