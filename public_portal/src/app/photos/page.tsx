'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Search, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getPhotoGalleries } from '@/lib/api/photo-galleries'

interface PhotoGalleryItem {
  id: string
  title: string
  excerpt?: string
  slug: string
  isPublished: boolean
  publishedAt?: string
  coverImage?: {
    id: string
    url: string
    filename: string
  } | null
  photos?: {
    id: string
    order: number
    caption?: string
    media: {
      id: string
      filename: string
      url: string
      type: string
      altText?: string
    }
  }[]
}

interface GalleryResponse {
  data: PhotoGalleryItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function PhotosPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['photo-galleries', debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getPhotoGalleries({
        page: pageParam as number,
        limit: 12,
        search: debouncedSearch || undefined,
      })
      return {
        data: result.data,
        pagination: result.pagination,
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })

  const galleries = data?.pages.flatMap((page) => page.data) || []

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
             <h1 className="text-3xl font-bold mb-4">फोटो ग्यालरीहरू</h1>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ग्यालरीहरू खोज्नुहोस्..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Galleries Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="w-full aspect-[16/9] rounded-t-lg" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load galleries</p>
              <p className="text-sm text-muted-foreground mt-2">{error?.message}</p>
            </div>
          ) : galleries.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No galleries found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((gallery) => (
                  <Link key={gallery.id} href={`/photos/${gallery.slug}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative aspect-[16/9]">
                          {gallery.coverImage ? (
                              <Image
                               src={gallery.coverImage.url}
                               alt={gallery.title || ''}
                               fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                             <h3 className="text-white font-semibold">{gallery.title || ''}</h3>
                            {gallery.publishedAt && (
                              <p className="text-white/80 text-sm">
                                {new Date(gallery.publishedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Load More */}
              {hasNextPage && (
                <div className="text-center mt-8">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="outline"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
