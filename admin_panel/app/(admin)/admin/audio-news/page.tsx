'use client'

import { useState, useRef } from 'react'
import { Plus, Search, Trash2, Eye, EyeOff, Play, Upload, Music } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/ui/page-header'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { toast } from 'sonner'
import {
  useAudioNews,
  useCreateAudioNews,
  useDeleteAudioNews,
  useTogglePublishAudioNews
} from '@/hooks/use-audio-news'
import { FeaturedImageSelector } from '@/components/featured-image-selector'
import { Media } from '@/types'

export default function AudioNewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    titleNe: '',
    titleEn: '',
    descriptionNe: '',
    descriptionEn: '',
    categoryId: '',
    isPublished: false
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailMedia, setThumbnailMedia] = useState<Media | null>(null)
  const [existingAudioUrl, setExistingAudioUrl] = useState<string>('')
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useAudioNews({ search: searchQuery || undefined })
  const createMutation = useCreateAudioNews()
  const deleteMutation = useDeleteAudioNews()
  const togglePublish = useTogglePublishAudioNews()

  const handleCreate = async () => {
    if (!formData.titleEn || !formData.titleNe || !audioFile) {
      toast.error('Please fill all required fields and upload an audio file')
      return
    }
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('titleNe', formData.titleNe)
      formDataToSend.append('titleEn', formData.titleEn)
      if (formData.descriptionNe) formDataToSend.append('descriptionNe', formData.descriptionNe)
      if (formData.descriptionEn) formDataToSend.append('descriptionEn', formData.descriptionEn)
      if (formData.categoryId) formDataToSend.append('categoryId', formData.categoryId)
      formDataToSend.append('isPublished', formData.isPublished.toString())
      formDataToSend.append('audioFile', audioFile)
      if (thumbnailFile) formDataToSend.append('thumbnailFile', thumbnailFile)
      else if (thumbnailMedia?.url) formDataToSend.append('thumbnailUrl', thumbnailMedia.url)

      const response = await fetch('/api/admin/audio-news', {
        method: 'POST',
        body: formDataToSend,
      })
      const result = await response.json()
      if (result.success) {
        toast.success('Audio news created successfully')
        setShowForm(false)
        setFormData({ titleNe: '', titleEn: '', descriptionNe: '', descriptionEn: '', categoryId: '', isPublished: false })
        setAudioFile(null)
        setThumbnailFile(null)
        setThumbnailMedia(null)
      } else {
        const errorMessage = result.message || 'Failed to create audio news'
        toast.error(errorMessage)
      }
    } catch {
      toast.error('Failed to create audio news')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.titleEn || !formData.titleNe) {
      toast.error('Please fill all required fields')
      return
    }
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('titleNe', formData.titleNe)
      formDataToSend.append('titleEn', formData.titleEn)
      if (formData.descriptionNe) formDataToSend.append('descriptionNe', formData.descriptionNe)
      if (formData.descriptionEn) formDataToSend.append('descriptionEn', formData.descriptionEn)
      if (formData.categoryId) formDataToSend.append('categoryId', formData.categoryId)
      formDataToSend.append('isPublished', formData.isPublished.toString())
      // Only include audio file if a new one is selected
      if (audioFile) formDataToSend.append('audioFile', audioFile)
      // Only include thumbnail file if a new one is selected
      if (thumbnailFile) formDataToSend.append('thumbnailFile', thumbnailFile)
      // Include thumbnailUrl when using media library selection (no new file, but has media)
      else if (thumbnailMedia?.url && !thumbnailFile) formDataToSend.append('thumbnailUrl', thumbnailMedia.url)

      const response = await fetch(`/api/admin/audio-news/${editingId}`, {
        method: 'PATCH',
        body: formDataToSend,
      })
      const result = await response.json()
      if (result.success) {
        toast.success('Audio news updated successfully')
        setShowForm(false)
        setEditingId(null)
        setFormData({ titleNe: '', titleEn: '', descriptionNe: '', descriptionEn: '', categoryId: '', isPublished: false })
        setAudioFile(null)
        setThumbnailFile(null)
        setThumbnailMedia(null)
        setExistingAudioUrl('')
        setExistingThumbnailUrl('')
      } else {
        const errorMessage = result.message || 'Failed to update audio news'
        toast.error(errorMessage)
      }
    } catch {
      toast.error('Failed to update audio news')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (audioNews: any) => {
    setFormData({
      titleNe: audioNews.titleNe,
      titleEn: audioNews.titleEn,
      descriptionNe: audioNews.descriptionNe || '',
      descriptionEn: audioNews.descriptionEn || '',
      categoryId: audioNews.categoryId || '',
      isPublished: audioNews.isPublished
    })
    setExistingAudioUrl(audioNews.audioUrl || '')
    setExistingThumbnailUrl(audioNews.thumbnailUrl || '')
    // Set thumbnail media if there's an existing URL
    if (audioNews.thumbnailUrl) {
      setThumbnailMedia({
        id: audioNews.thumbnailUrl,
        url: audioNews.thumbnailUrl,
        filename: audioNews.thumbnailUrl.split('/').pop() || 'thumbnail',
        type: 'IMAGE' as const,
        size: 0,
        uploadedBy: '',
        createdAt: new Date()
      } as Media)
    } else {
      setThumbnailMedia(null)
    }
    setAudioFile(null)
    setThumbnailFile(null)
    setEditingId(audioNews.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ titleNe: '', titleEn: '', descriptionNe: '', descriptionEn: '', categoryId: '', isPublished: false })
    setAudioFile(null)
    setThumbnailFile(null)
    setThumbnailMedia(null)
    setExistingAudioUrl('')
    setExistingThumbnailUrl('')
  }

  const audioNewsList = data?.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audio News"
        description="Manage audio news with bilingual content"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Audio News
          </Button>
        }
      />

      {/* Create/Edit Form */}
      {showForm && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">{editingId ? 'Edit Audio News' : 'Add New Audio News'}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Title (English) *</label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) => setFormData(p => ({ ...p, titleEn: e.target.value }))}
                  placeholder="Enter title in English"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title (Nepali) *</label>
                <Input
                  value={formData.titleNe}
                  onChange={(e) => setFormData(p => ({ ...p, titleNe: e.target.value }))}
                  placeholder="Enter title in Nepali"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description (English)</label>
              <Textarea
                value={formData.descriptionEn}
                onChange={(e) => setFormData(p => ({ ...p, descriptionEn: e.target.value }))}
                placeholder="Enter description in English"
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description (Nepali)</label>
              <Textarea
                value={formData.descriptionNe}
                onChange={(e) => setFormData(p => ({ ...p, descriptionNe: e.target.value }))}
                placeholder="Enter description in Nepali"
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Audio File *</label>
              <div className="mt-1">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="audio-file-input"
                />
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline">
                    <label htmlFor="audio-file-input" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Audio File
                    </label>
                  </Button>
                  {audioFile && (
                    <span className="text-sm text-slate-500">{audioFile.name}</span>
                  )}
                  {!audioFile && existingAudioUrl && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Music className="w-4 h-4" /> Existing file uploaded
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">Allowed: MP3, WAV, OGG, M4A, WebM</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Thumbnail Image</label>
              <div className="mt-3">
                <FeaturedImageSelector
                  value={thumbnailMedia}
                  onChange={(media) => setThumbnailMedia(media)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData(p => ({ ...p, isPublished: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="isPublished" className="text-sm font-medium">Publish immediately</label>
            </div>
            <div className="flex gap-2">
              <Button onClick={editingId ? handleUpdate : handleCreate} disabled={isSubmitting}>
                {isSubmitting ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Audio News' : 'Create Audio News')}
              </Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search audio news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Audio News Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : audioNewsList.length === 0 ? (
        <EmptyState title="No audio news yet" description="Add your first audio news to get started." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {audioNewsList.map((audio) => (
            <Card key={audio.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-slate-900">
                  {audio.thumbnailUrl ? (
                    <img
                      src={audio.thumbnailUrl}
                      alt={audio.titleEn}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                      <Play className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${audio.isPublished ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                      {audio.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-black/70 text-white">
                      {audio.viewCount} views
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm truncate">{audio.titleEn}</p>
                  <p className="text-xs text-slate-500 truncate">{audio.titleNe}</p>
                  <p className="text-xs text-slate-400 mt-1">by {audio.author?.name}</p>
                  <div className="flex gap-1 mt-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(audio)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublish.mutate({ id: audio.id, isPublished: !audio.isPublished }, {
                        onSuccess: () => toast.success(audio.isPublished ? 'Unpublished' : 'Published'),
                      })}
                    >
                      {audio.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(audio.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, {
              onSuccess: () => { toast.success('Audio news deleted'); setDeleteId(null) },
              onError: (error: unknown) => {
                const errorMessage = error instanceof Error ? error.message : 'Failed to delete audio news'
                toast.error(errorMessage)
              },
            })
          }
        }}
        title="Delete Audio News"
        description="Are you sure you want to delete this audio news? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}