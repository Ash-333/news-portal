'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Image, Video, FileText, Search, Trash2, Copy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Media, ApiResponse, PaginationInfo } from '@/types'

interface MediaResponse {
  data: Media[]
  pagination: PaginationInfo
}

const fetchMedia = async (page: number = 1, type?: string): Promise<MediaResponse> => {
  const searchParams = new URLSearchParams()
  searchParams.set('page', page.toString())
  if (type) searchParams.set('type', type)

  const response = await fetch(`/api/admin/media?${searchParams}`)
  const result: ApiResponse<Media[]> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return {
    data: result.data,
    pagination: result.pagination!,
  }
}

const deleteMedia = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/media/${id}`, {
    method: 'DELETE',
  })
  const result: ApiResponse<null> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
}

const tabs = [
  { key: 'ALL', label: 'All', icon: Image },
  { key: 'IMAGE', label: 'Images', icon: Image },
  { key: 'VIDEO', label: 'Videos', icon: Video },
  { key: 'DOCUMENT', label: 'Documents', icon: FileText },
]

export default function MediaPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')

  const type = activeTab === 'ALL' ? undefined : activeTab
  const { data, isLoading } = useQuery({
    queryKey: ['media', type],
    queryFn: () => fetchMedia(1, type),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
      toast.success('Media deleted successfully')
      setDeleteId(null)
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete media'
      toast.error(errorMessage)
    },
  })

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    if (uploadTitle) {
      formData.append('title', uploadTitle)
    }

    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()
      
      if (result.success) {
        toast.success('File uploaded successfully')
        queryClient.invalidateQueries({ queryKey: ['media'] })
      } else {
        const errorMessage = result.message || 'Failed to upload file'
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }, [queryClient])

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard')
  }

  const filteredMedia = data?.data.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Manager"
        description="Upload and manage media files"
      />

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <p className="text-lg font-medium mb-2">Upload Files</p>
            <p className="text-sm text-slate-500 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <div className="max-w-sm mx-auto mb-4">
              <Input
                placeholder="File Title (optional)"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="mb-2"
              />
            </div>
            <Input
              type="file"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="file-upload"
            />
            <Button asChild disabled={isUploading}>
              <label htmlFor="file-upload" className="cursor-pointer">
                {isUploading ? 'Uploading...' : 'Select File'}
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMedia?.length === 0 ? (
        <EmptyState
          title="No media files"
          description="Upload your first media file to get started."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredMedia?.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                  {item.type === 'IMAGE' ? (
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : item.type === 'VIDEO' ? (
                    <Video className="w-12 h-12 text-slate-400" />
                  ) : (
                    <FileText className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{item.filename}</p>
                  <p className="text-xs text-slate-500">
                    {(item.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopyUrl(item.url)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Media"
        description="Are you sure you want to delete this file? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
