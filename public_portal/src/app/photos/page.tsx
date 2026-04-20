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
import { useLanguage } from '@/context/LanguageContext'

interface PhotoGalleryItem {
  id: string
  titleNe: string
  titleEn: string
  excerptNe?: string
  excerptEn?: string
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
    captionNe?: string
    captionEn?: string
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
  const { isNepali } = useLanguage()

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
  } = useInfiniteQuery<GalleryResponse, Error, { pages: GalleryResponse[]; pageParams: number[] }, string[], number>({
    queryKey: ['photo-galleries', debouncedSearch],
    queryFn: async ({ pageParam }) => {
      const result = await getPhotoGalleries({
        page: pageParam,
        limit: 12,
        search: debouncedSearch || undefined,
      })
      if (!result) {
        throw new Error('No result returned from API')
      }
      if (Array.isArray(result)) {
        return { data: result, pagination: { page: pageParam, limit: 12, total: result.length, totalPages: 1 } } as GalleryResponse
      }
      if (!result.data) {
        throw new Error('No data in API response')
      }
      return result as GalleryResponse
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined
      const { totalPages, page } = lastPage.pagination
      if (page < totalPages) {
        return page + 1
      }
      return undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })

  const galleries: PhotoGalleryItem[] = data?.pages
    ?.flatMap((page) => page?.data ?? [])
    ?.filter((gallery): gallery is PhotoGalleryItem => {
      return !!(gallery && gallery.id && gallery.slug)
    }) ?? []

  const getTitle = (gallery: PhotoGalleryItem) => {
    return isNepali ? gallery.titleNe : gallery.titleEn
  }

  const getExcerpt = (gallery: PhotoGalleryItem) => {
    return isNepali ? gallery.excerptNe : gallery.excerptEn
  }

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardContent className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">
        {isNepali ? 'कुनै ग्यालरी फेला परेन' : 'No galleries found'}
      </h3>
      <p className="text-slate-500">
        {isNepali
          ? 'आफ्नो खोज समायोज्नुहोस् वा पछि फेरि जानुहोस्।'
          : 'Try adjusting your search or check back later.'}
      </p>
    </div>
  )

  const renderErrorState = () => (
    <div className="text-center py-12">
      <ImageIcon className="w-16 h-16 text-red-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2 text-red-600">
        {isNepali ? 'त्रुटि भयो' : 'Something went wrong'}
      </h3>
      <p className="text-slate-500">
        {error?.message || (isNepali
          ? 'ग्यालरीहरू लोड गर्न सकिएन।'
          : 'Failed to load galleries.')}
      </p>
    </div>
  )

  const renderGalleryGrid = () => {
    if (galleries.length === 0) {
      return renderEmptyState()
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleries.map((gallery) => (
            <Link
              key={gallery.id}
              href={`/photos/${gallery.slug}/`}
              className="block"
            >
              <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                  {gallery.coverImage?.url ? (
                    <Image
                      src={gallery.coverImage.url}
                      alt={getTitle(gallery)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {gallery.photos?.length ?? 0} {isNepali ? 'फोटो' : 'photos'}
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {getTitle(gallery)}
                  </h3>
                  {getExcerpt(gallery) && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {getExcerpt(gallery)}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    {gallery.publishedAt
                      ? new Date(gallery.publishedAt).toLocaleDateString(
                        isNepali ? 'ne-NP' : 'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }
                      )
                      : isNepali
                        ? 'ड्राफ्ट'
                        : 'Draft'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {hasNextPage && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="min-w-[150px]"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isNepali ? 'लोड हुँदै...' : 'Loading...'}
                </>
              ) : (
                isNepali ? 'थप हेर्नुहोस्' : 'Load More'
              )}
            </Button>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isNepali ? 'फोटो ग्यालरीहरू' : 'Photo Galleries'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {isNepali
              ? 'हाम्रो फोटो ग्यालरी संग्रह हेर्नुहोस्'
              : 'Browse our collection of photo galleries'}
          </p>
        </div>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={isNepali ? 'ग्यालरी खोज्नुहोस्...' : 'Search galleries...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          renderLoadingSkeleton()
        ) : isError ? (
          renderErrorState()
        ) : (
          renderGalleryGrid()
        )}
      </div>
    </div>
  )
}