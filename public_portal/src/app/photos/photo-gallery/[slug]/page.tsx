'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  ArrowLeft,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getPhotoGalleryBySlug } from '@/lib/api/photo-galleries'
import { PhotoGallery } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function PhotoGalleryDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const { data, isLoading, error } = useQuery({
    queryKey: ['photo-gallery', slug],
    queryFn: () => getPhotoGalleryBySlug(slug, { revalidate: 300 }),
  })

  if (error) {
    notFound()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-video" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Gallery not found</h1>
          <Link href="/photos">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Galleries
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const gallery: PhotoGallery = data
  const photos = gallery.photos.sort((a, b) => a.order - b.order)

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goToPhoto = (index: number) => {
    setCurrentPhotoIndex(index)
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'ArrowLeft') prevPhoto()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link href="/photos" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          All Galleries
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{gallery.titleEn}</h1>
          {gallery.excerptEn && (
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 max-w-3xl">
              {gallery.excerptEn}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {gallery.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(gallery.publishedAt).toLocaleDateString()}
              </div>
            )}
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {gallery.author.name}
            </div>
            <span>{photos.length} photos</span>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <Card
              key={photo.id}
              className="overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                <Image
                  src={photo.media.url}
                  alt={photo.captionEn || photo.media.filename}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm">View</span>
                </div>
              </div>
              {photo.captionEn && (
                <CardContent className="p-3">
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                    {photo.captionEn}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && photos[currentPhotoIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                onClick={prevPhoto}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                onClick={nextPhoto}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Photo Display */}
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <Image
              src={photos[currentPhotoIndex].media.url}
              alt={photos[currentPhotoIndex]?.captionEn || photos[currentPhotoIndex]?.media.filename}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Thumbnail Navigation */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto py-2">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => goToPhoto(index)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${
                    index === currentPhotoIndex
                      ? 'border-white'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={photo.media.url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Caption */}
          {photos[currentPhotoIndex]?.captionEn && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded max-w-2xl text-center">
              <p>{photos[currentPhotoIndex].captionEn}</p>
            </div>
          )}

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded text-sm">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  )
}
