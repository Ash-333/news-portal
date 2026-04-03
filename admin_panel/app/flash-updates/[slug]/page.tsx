'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Zap, Clock, User, ArrowLeft, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

interface FlashUpdate {
  id: string
  titleNe: string
  titleEn: string
  contentNe: string
  contentEn: string
  excerptNe?: string
  excerptEn?: string
  slug: string
  publishedAt: string | null
  expiresAt: string | null
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
  featuredImage: {
    id: string
    url: string
  } | null
  author: {
    id: string
    name: string | null
    profilePhoto: string | null
  } | null
}

export default function FlashUpdatePage() {
  const params = useParams()
  const slug = params?.slug as string
  const [isLoading, setIsLoading] = useState(true)
  const [flashUpdate, setFlashUpdate] = useState<FlashUpdate | null>(null)
  const [error, setError] = useState(false)
  const [activeContent, setActiveContent] = useState<'en' | 'ne'>('en')

  // Fetch flash update on mount
  useEffect(() => {
    if (!slug) return

    fetch(`/api/flash-updates/${slug}`)
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          setFlashUpdate(result.data)
        } else {
          setError(true)
        }
        setIsLoading(false)
      })
      .catch(() => {
        setError(true)
        setIsLoading(false)
      })
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-40 w-full mt-4" />
        </div>
      </div>
    )
  }

  if (error || !flashUpdate) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <Zap className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Flash Update Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The flash update you are looking for does not exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/flash-updates">Go to Flash Updates</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const title = activeContent === 'en' ? flashUpdate.titleEn : flashUpdate.titleNe
  const content = activeContent === 'en' ? flashUpdate.contentEn : flashUpdate.contentNe
  const excerpt = activeContent === 'en' ? flashUpdate.excerptEn : flashUpdate.excerptNe

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link href="/flash-updates">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Flash Updates
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

        {/* Flash Update Card */}
        <Card>
          <CardContent className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              {/* Flash Update Badge */}
              <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                <span>Flash Update</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                {title}
              </h1>

              {/* Excerpt */}
              {excerpt && (
                <p className="text-lg text-muted-foreground mb-6">{excerpt}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                {flashUpdate.author && (
                  <div className="flex items-center gap-2">
                    {flashUpdate.author.profilePhoto ? (
                      <img
                        src={flashUpdate.author.profilePhoto}
                        alt={flashUpdate.author.name || ''}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="font-medium text-foreground">
                      {flashUpdate.author.name}
                    </span>
                  </div>
                )}

                {flashUpdate.publishedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(flashUpdate.publishedAt)}</span>
                  </div>
                )}

                {flashUpdate.expiresAt && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span>Expires: {formatDate(flashUpdate.expiresAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image */}
            {flashUpdate.featuredImage && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={flashUpdate.featuredImage.url}
                  alt={title}
                  className="w-full h-auto object-cover max-h-[500px]"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content || '' }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}