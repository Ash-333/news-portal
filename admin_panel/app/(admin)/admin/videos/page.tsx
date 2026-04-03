'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { toast } from 'sonner'
import { useVideos, useDeleteVideo, useTogglePublishVideo } from '@/hooks/use-videos'

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ titleNe: '', titleEn: '', youtubeUrl: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, isLoading } = useVideos({ search: searchQuery || undefined })
  const deleteMutation = useDeleteVideo()
  const togglePublish = useTogglePublishVideo()

  const handleCreate = async () => {
    if (!formData.titleEn || !formData.titleNe || !formData.youtubeUrl) {
      toast.error('Please fill all fields')
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (result.success) {
        toast.success('Video created successfully')
        setShowForm(false)
        setFormData({ titleNe: '', titleEn: '', youtubeUrl: '' })
        window.location.reload()
      } else {
        toast.error(result.message || 'Failed to create video')
      }
    } catch {
      toast.error('Failed to create video')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Extract YouTube thumbnail for preview
  const getPreviewThumb = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null
  }

  const videos = data?.data ?? []
  const previewThumb = getPreviewThumb(formData.youtubeUrl)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Videos"
        description="Manage YouTube videos"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        }
      />

      {/* Create Form */}
      {showForm && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Add New Video</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Title (English)</label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) => setFormData(p => ({ ...p, titleEn: e.target.value }))}
                  placeholder="Enter video title in English"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title (Nepali)</label>
                <Input
                  value={formData.titleNe}
                  onChange={(e) => setFormData(p => ({ ...p, titleNe: e.target.value }))}
                  placeholder="Enter video title in Nepali"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">YouTube URL</label>
              <Input
                value={formData.youtubeUrl}
                onChange={(e) => setFormData(p => ({ ...p, youtubeUrl: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1"
              />
            </div>
            {previewThumb && (
              <div className="mt-2">
                <p className="text-sm text-slate-500 mb-1">Thumbnail Preview:</p>
                <img src={previewThumb} alt="Thumbnail preview" className="w-48 rounded-lg" />
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Video'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Videos Grid */}
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
      ) : videos.length === 0 ? (
        <EmptyState title="No videos yet" description="Add your first YouTube video to get started." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-slate-900">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.titleEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${video.isPublished ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                      {video.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm truncate">{video.titleEn}</p>
                  <p className="text-xs text-slate-500 truncate">{video.titleNe}</p>
                  <p className="text-xs text-slate-400 mt-1">by {video.author?.name}</p>
                  <div className="flex gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublish.mutate({ id: video.id, isPublished: !video.isPublished }, {
                        onSuccess: () => toast.success(video.isPublished ? 'Unpublished' : 'Published'),
                      })}
                    >
                      {video.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(video.id)}>
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
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId, {
          onSuccess: () => { toast.success('Video deleted'); setDeleteId(null) },
          onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete video'
            toast.error(errorMessage)
          },
        })}
        title="Delete Video"
        description="Are you sure you want to delete this video?"
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
