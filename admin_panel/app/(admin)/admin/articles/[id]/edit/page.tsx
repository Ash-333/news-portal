'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, Send, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { PageHeader } from '@/components/ui/page-header'
import { useCategories } from '@/hooks/use-categories'
import { useTags } from '@/hooks/use-tags'
import { useArticle, useUpdateArticle, useSubmitForReview } from '@/hooks/use-articles'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { TipTapEditor } from '@/components/tiptap-editor'
import { FeaturedImageSelector } from '@/components/featured-image-selector'
import { MediaLibraryModal } from '@/components/media-library-modal'
import { Select } from '@/components/ui/select'
import type { Media } from '@/types'
import AuthorSelect from '@/components/author-select'
import { articleSchema } from '@/lib/validations'
import type { ArticleFormData } from '@/lib/validations'

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [featuredMedia, setFeaturedMedia] = useState<Media | null>(null)
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
  const [pendingImageInsert, setPendingImageInsert] = useState<((url: string) => void) | null>(null)
  
  const { data: article, isLoading: articleLoading } = useArticle(id)
  const { data: categories } = useCategories()
  const { data: tags } = useTags()
  const updateArticle = useUpdateArticle()
  const submitForReview = useSubmitForReview()
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
   } = useForm<ArticleFormData>({
     resolver: zodResolver(articleSchema),
     defaultValues: {
       featuredImageId: '',
       authorId: '',
     },
   })

   // Reset form when article loads
   useEffect(() => {
     if (article) {
       // Determine if the article's category is a subcategory
       const category = categories?.find(cat => cat.id === article.categoryId)
       const isSubcategory = category?.parentId
       const mainCategoryId = isSubcategory ? category?.parentId : article.categoryId
       const subcategoryId = isSubcategory ? article.categoryId : ''

         reset({
           title: article.title,
           subheading: article.subheading || '',
           content: article.content,
           excerpt: article.excerpt || '',
           categoryId: mainCategoryId || '',
           subcategoryId: subcategoryId,
           metaTitle: article.metaTitle || '',
           metaDescription: article.metaDescription || '',
           isFlashUpdate: article.isFlashUpdate,
           isFeatured: article.isFeatured,
           isTitleOnly: article.isTitleOnly || false,
           featuredImageId: article.featuredImageId || '',
           authorId: article.authorId || '',
         })
      // Set selected tags from article
      const articleTags = article.tags || []
      setSelectedTags(articleTags.map((t: any) => t.id))
      setFeaturedMedia(article.featuredImage as Media | null)
    }
  }, [article, categories, reset])

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
      await updateArticle.mutateAsync({ id, data: { ...data, categoryId: finalCategoryId, tagIds: selectedTags } })
      toast.success('Article updated successfully')
      router.push('/admin/articles')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update article'
      toast.error(errorMessage)
    }
  }

  if (articleLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-96" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Article"
        description="Update article content"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/admin/articles')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button variant="outline" onClick={() => {
              if (article?.slug) {
                window.open(`/articles/${article.slug}?preview=true`, '_blank')
              }
            }} disabled={!article?.slug}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        }
      />

       <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
         {/* Main Content */}
         <div className="lg:col-span-2 space-y-6">
           <Card>
             <CardContent className="p-6">
               <div className="space-y-4">
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
                   <Label htmlFor="subheading">Subheading (optional)</Label>
                   <Input
                     id="subheading"
                     {...register('subheading')}
                     placeholder="Enter subheading"
                     className="mt-1"
                   />
                 </div>

                 <div>
                   <Label htmlFor="excerpt">Excerpt (optional)</Label>
                   <textarea
                     id="excerpt"
                     {...register('excerpt')}
                     placeholder="Brief summary of the article"
                     className="mt-1 block w-full rounded-md border bg-background p-2 text-sm"
                     rows={3}
                   />
                 </div>

                 {/* SEO Settings */}
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
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              
              {article?.status === 'DRAFT' && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={submitForReview.isPending}
                  onClick={async () => {
                    try {
                      await submitForReview.mutateAsync(id)
                      toast.success('Article submitted for review')
                    } catch (error: unknown) {
                      const errorMessage = error instanceof Error ? error.message : 'Failed to submit for review'
                      toast.error(errorMessage)
                    }
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit for Review
                </Button>
              )}
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
                  className="mt-1"
                  defaultValue={article?.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    const value = e.target.value.includes(':') && e.target.value.split(':').length === 2
                      ? e.target.value + ':00'
                      : e.target.value
                    setValue('publishedAt', value, { shouldDirty: true })
                  }}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Set custom publish date or leave empty (will auto-set when published)
                </p>
              </div>
              {article?.publishedAt && (
                <div className="text-sm text-slate-500">
                  Currently published: {new Date(article.publishedAt).toLocaleString()}
                </div>
              )}
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
                  className="mt-1"
                  defaultValue={article?.scheduledAt ? new Date(article.scheduledAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      // Ensure format has seconds for proper handling
                      const value = e.target.value.includes(':') && e.target.value.split(':').length === 2
                        ? e.target.value + ':00'
                        : e.target.value
                      setValue('scheduledAt', value, { shouldDirty: true })
                    }
                  }}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Leave empty to publish immediately or save as draft
                </p>
              </div>
              {article?.scheduledAt && (
                <div className="text-sm text-slate-500">
                  Currently scheduled for: {new Date(article.scheduledAt).toLocaleString()}
                </div>
              )}
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
