'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, User, Eye, Tag } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { ApiResponse } from '@/types'

async function fetchArticleBySlug(slug: string, isPreview: boolean) {
  console.log('Fetching article:', slug, 'isPreview:', isPreview)
  if (isPreview) {
    const response = await fetch(`/api/admin/articles?search=${encodeURIComponent(slug)}`, {
      credentials: 'include',
    })
    console.log('Response status:', response.status)
    if (!response.ok) {
      const error = await response.json()
      console.error('API Error:', error)
      throw new Error(error.message || 'Failed to fetch article')
    }
    const result = await response.json()
    console.log('API Result:', result)
    if (!result.success) {
      throw new Error(result.message)
    }
    const articles = result.data?.data || result.data || []
    console.log('Found articles:', articles.length)
    return articles.find((a: any) => a.slug === slug) || null
  } else {
    const response = await fetch(`/api/articles/${slug}`)
    const result: ApiResponse<any> = await response.json()
    if (!result.success) {
      throw new Error(result.message)
    }
    return result.data
  }
}

export default function ArticlePage() {
  const params = useParams()
  const slug = params?.slug as string
  const urlParams = typeof window !== 'undefined' ? new URL(window.location.href).searchParams : null
  const isPreview = urlParams ? urlParams.get('preview') === 'true' : false
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', slug, isPreview],
    queryFn: () => fetchArticleBySlug(slug, isPreview),
    enabled: !!slug,
  })
  
  const [activeContent, setActiveContent] = useState<'en' | 'ne'>('en')

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">
            {isPreview ? 'Preview Unavailable' : 'Article Not Found'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isPreview 
              ? 'This article is not yet published. Go to edit page to preview.'
              : 'The article you are looking for does not exist or has been removed.'}
          </p>
          {isPreview && (
            <Button asChild>
              <Link href={`/admin/articles`}>Go to Articles</Link>
            </Button>
          )}
          {!isPreview && (
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          )}
        </div>
      </div>
    )
  }

  const title = activeContent === 'en' ? article.titleEn : article.titleNe
  const content = activeContent === 'en' ? article.contentEn : article.contentNe
  const excerpt = activeContent === 'en' ? article.excerptEn : article.excerptNe

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </Button>

      {/* Language Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeContent === 'en' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveContent('en')}
        >
          English
        </Button>
        <Button
          variant={activeContent === 'ne' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveContent('ne')}
        >
          नेपाली
        </Button>
      </div>

      {/* Article Header */}
      <article>
        <header className="mb-8">
          {/* Category Badge */}
          {article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4 hover:bg-primary/20 transition-colors"
            >
              {activeContent === 'en' ? article.category.nameEn : article.category.nameNe}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {title}
          </h1>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-lg text-muted-foreground mb-6">{excerpt}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {article.author && (
              <div className="flex items-center gap-2">
                {article.author.profilePhoto ? (
                  <img
                    src={article.author.profilePhoto}
                    alt={article.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="font-medium text-foreground">{article.author.name}</span>
              </div>
            )}

            {article.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.viewCount} views</span>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map((tag: { id: string; nameNe: string; nameEn: string; slug: string }) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="flex items-center gap-1 text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/80 transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {activeContent === 'en' ? tag.nameEn : tag.nameNe}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8">
            <img
              src={article.featuredImage.url}
              alt={title}
              className="w-full h-auto rounded-lg object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Flash Update Badge */}
        {article.isFlashUpdate && (
          <div className="bg-red-600 text-white px-4 py-2 rounded-md mb-6 font-medium">
            🔴 Flash Update
          </div>
        )}

        {/* Article Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>

      {/* Article Footer */}
      <footer className="mt-12 pt-8 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {article.comments} comments
          </div>
        </div>
      </footer>
    </div>
  )
}
