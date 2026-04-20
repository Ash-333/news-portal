'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getPhotoGalleriesForHomepage } from '@/lib/api/photo-galleries'
import { PhotoGallery } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/context/LanguageContext'

export function PhotoGallerySection() {
  const { isNepali } = useLanguage()
  const { data: galleries = [], isLoading } = useQuery({
    queryKey: ['photo-galleries', 'homepage'],
    queryFn: () => getPhotoGalleriesForHomepage(6),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  if (isLoading) {
    return (
      <section className="py-8 border-t border-news-border dark:border-news-border-dark">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (galleries.length === 0) return null

  return (
    <section className="py-8 border-t border-news-border dark:border-news-border-dark">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-news-red rounded-full" />
            <h2 className="text-2xl font-bold">
              {isNepali ? 'फोटो ग्यालरीहरू' : 'Photo Galleries'}
            </h2>
          </div>
          <Link href="/photos">
            <Button variant="outline" size="sm">
              {isNepali ? 'सबै हेर्नुहोस्' : 'View All'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleries.map((gallery: PhotoGallery) => (
            <Link key={gallery.id} href={`/photos/${gallery.slug}/`}>
              <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                  {gallery.coverImage ? (
                    <Image
                      src={gallery.coverImage.url}
                      alt={isNepali ? gallery.titleNe : gallery.titleEn}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No image
                    </div>
                  )}
                  {/* Photo count badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {gallery.photos.length}
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-news-red transition-colors">
                    {isNepali ? gallery.titleNe : gallery.titleEn}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
