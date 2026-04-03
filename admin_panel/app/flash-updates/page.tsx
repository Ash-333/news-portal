'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, Clock, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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
  author: {
    name: string | null
    profilePhoto: string | null
  } | null
  featuredImage: {
    url: string
  } | null
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function FlashUpdatesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<FlashUpdate[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  // Fetch flash updates on mount
  useEffect(() => {
    fetch('/api/flash-updates')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setData(result.data)
          setPagination(result.pagination)
        }
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <Zap className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Flash Updates
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Latest breaking news and quick updates
          </p>
        </div>

        {/* Flash Updates List */}
        <div className="space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : data.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Zap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No flash updates available</p>
              </CardContent>
            </Card>
          ) : (
            data.map((update) => (
              <Link key={update.id} href={`/flash-updates/${update.slug}`} className="block">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    {/* Title */}
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {update.titleEn}
                    </h2>
                    
                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                      {update.author && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{update.author.name}</span>
                        </div>
                      )}
                      {update.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(update.publishedAt)}</span>
                        </div>
                      )}
                    </div>

                    {/* Featured Image */}
                    {update.featuredImage && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={update.featuredImage.url} 
                          alt={update.titleEn}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: update.contentEn || update.contentNe || '' 
                      }}
                    />
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`px-4 py-2 rounded-md ${
                  page === pagination.page 
                    ? 'bg-red-600 text-white' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}