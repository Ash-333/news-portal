import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPhotoGalleryBySlug } from '@/lib/api/photo-galleries'
import { getServerLanguage } from '@/lib/utils/language'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params, searchParams }: PhotoGalleryPageProps): Promise<Metadata> {
  const response = await getPhotoGalleryBySlug(params.slug)
  const urlLang = searchParams?.lang
  const isNepali = urlLang ? urlLang !== 'en' : getServerLanguage() === 'ne'
  const title = response.success && response.data
    ? (isNepali ? response.data.titleNe : response.data.titleEn)
    : 'Photo Gallery'

  return { title }
}

interface PhotoGalleryPageProps {
  params: { slug: string }
  searchParams: { lang?: string }
}

export default async function PhotoGalleryDetailPage({ params, searchParams }: PhotoGalleryPageProps) {
  const response = await getPhotoGalleryBySlug(params.slug)

  if (!response.success || !response.data) {
    notFound()
  }

  const gallery = response.data
  const photos = gallery.photos || []
  const urlLang = searchParams?.lang
  const isNepali = urlLang ? urlLang !== 'en' : getServerLanguage() === 'ne'
  const title = isNepali ? gallery.titleNe : gallery.titleEn
  const excerpt = isNepali ? gallery.excerptNe : gallery.excerptEn

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
          {gallery.createdAt && (
            <span>
              {new Date(gallery.createdAt).toLocaleDateString(isNepali ? 'ne-NP' : 'en-US', {
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
              const caption = isNepali ? photo.captionNe : photo.captionEn
              return (
                <div key={photo.id} className="relative w-full aspect-[16/9] bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={photo.media.url}
                    alt={photo.media.altText || caption || ''}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                  {caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3">
                      <p className="text-white text-sm">{caption}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {photos.length === 0 && (
          <p className="text-muted-foreground">No photos in this gallery yet.</p>
        )}
      </div>
    </div>
  )
}