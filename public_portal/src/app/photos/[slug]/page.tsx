import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPhotoGalleryBySlug } from '@/lib/api/photo-galleries'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PhotoGalleryPageProps): Promise<Metadata> {
  const response = await getPhotoGalleryBySlug(params.slug)
  const title = response.success && response.data ? response.data.title : 'Photo Gallery'
  return { title }
}

interface PhotoGalleryPageProps {
  params: { slug: string }
}

export default async function PhotoGalleryDetailPage({ params }: PhotoGalleryPageProps) {
  const response = await getPhotoGalleryBySlug(params.slug)

  if (!response.success || !response.data) {
    notFound()
  }

  const gallery = response.data
  const photos = gallery.photos || []
  const title = gallery.title
  const excerpt = gallery.excerpt

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/photos"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Galleries
        </Link>

        <h1 className="text-3xl font-bold mb-2">{title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
          {gallery.author && <span>By {gallery.author.name}</span>}
          {gallery.publishedAt && (
            <span>
              {new Date(gallery.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
        </div>

        {excerpt && (
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            {excerpt}
          </p>
        )}

        {photos.length > 0 && (
          <div className="space-y-8">
            {photos.map((photo) => {
              const caption = photo.caption || ''
              return (
                <div key={photo.id} className="relative w-full aspect-[16/9] bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={photo.media.url}
                    alt={photo.media.altText || caption || ''}
                    fill
                    className="object-cover"
                  />
                  {caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white">{caption}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
