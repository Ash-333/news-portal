'use client'

import { PhotoGalleryForm } from '@/components/photo-gallery-form'
import { useParams } from 'next/navigation'

export default function EditPhotoGalleryPage() {
  const params = useParams()
  const galleryId = params?.id as string | undefined
  if (!galleryId) return null
  return <PhotoGalleryForm galleryId={galleryId} isEditing={true} />
}
