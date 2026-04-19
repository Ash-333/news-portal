"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Image as ImageIcon, Upload, Search } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Media, ApiResponse, PaginationInfo } from "@/types"

interface MediaResponse {
  data: Media[]
  pagination: PaginationInfo
}

interface MediaLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect?: (media: Media) => void
  multiSelect?: boolean
  onMultiSelect?: (media: Media[]) => void
  selectedMediaIds?: string[]
}

const fetchImages = async (search?: string): Promise<MediaResponse> => {
  const searchParams = new URLSearchParams()
  searchParams.set("page", "1")
  searchParams.set("limit", "50")
  searchParams.set("type", "IMAGE")
  if (search) searchParams.set("search", search)

  const response = await fetch(`/api/admin/media?${searchParams.toString()}`)
  const result: ApiResponse<Media[]> = await response.json()

  if (!result.success) {
    throw new Error(result.message)
  }

  return {
    data: result.data,
    pagination: result.pagination!,
  }
}

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  multiSelect = false,
  onMultiSelect,
  selectedMediaIds = [],
}: MediaLibraryModalProps) {
  const queryClient = useQueryClient()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([...selectedMediaIds])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadTitle, setUploadTitle] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if ((debounceTimer as any).current) clearTimeout((debounceTimer as any).current)
      ; (debounceTimer as any).current = setTimeout(() => {
        setDebouncedSearch(searchInput)
      }, 300)
    return () => { if ((debounceTimer as any).current) clearTimeout((debounceTimer as any).current) }
  }, [searchInput])

  // Reset selected IDs when modal opens/closes or selectedMediaIds changes
  useEffect(() => {
    if (isOpen) {
      setSelectedIds([...selectedMediaIds])
      setSelectedId(null)
    }
  }, [isOpen])

  const { data, isLoading } = useQuery({
    queryKey: ["media", "images", debouncedSearch],
    queryFn: () => fetchImages(debouncedSearch || undefined),
    enabled: isOpen,
  })

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)
      if (uploadTitle) {
        formData.append("title", uploadTitle)
      }

      try {
        const response = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        })
        const result: ApiResponse<Media> = await response.json()

        if (result.success) {
          setUploadTitle("")
          await queryClient.invalidateQueries({ queryKey: ["media", "images"] })
        }
      } finally {
        setIsUploading(false)
      }
    },
    [queryClient],
  )

  const handleConfirm = () => {
    if (multiSelect && onMultiSelect) {
      if (!data?.data) return
      const mediaItems = data.data.filter((m) => selectedIds.includes(m.id))
      onMultiSelect(mediaItems)
      setSelectedIds([])
      onClose()
    } else {
      if (!selectedId || !data?.data) return
      const media = data.data.find((m) => m.id === selectedId)
      if (!media || !onSelect) return
      onSelect(media)
      setSelectedId(null)
      onClose()
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const images = data?.data ?? []

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {multiSelect ? 'Select Photos for Gallery' : 'Media Library'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search images..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Upload */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center space-y-3">
            <Upload className="w-8 h-8 mx-auto text-slate-400" />
            <div className="max-w-xs mx-auto">
              <Input
                placeholder="Enter image name..."
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="text-xs h-8"
              />
            </div>
            <p className="text-xs text-slate-500">Upload a new image</p>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="media-library-upload"
            />
            <Button asChild size="sm" disabled={isUploading}>
              <label htmlFor="media-library-upload" className="cursor-pointer">
                {isUploading ? "Uploading..." : "Select Image"}
              </label>
            </Button>
          </div>

          {/* Selection count for multi-select */}
          {multiSelect && selectedIds.length > 0 && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {selectedIds.length} photo{selectedIds.length > 1 ? 's' : ''} selected
            </p>
          )}

          {/* Images grid */}
          {isLoading ? (
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-3">
                    <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : images.length === 0 ? (
            <EmptyState
              title="No images found"
              description="Upload an image to get started."
            />
          ) : (
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-[360px] overflow-y-auto">
              {images.map((item) => {
                const isSelected = multiSelect ? selectedIds.includes(item.id) : selectedId === item.id
                return (
                  <Card
                    key={item.id}
                    className={
                      "cursor-pointer overflow-hidden border-2 " +
                      (isSelected
                        ? "border-primary"
                        : "border-transparent hover:border-slate-300 dark:hover:border-slate-700")
                    }
                    onClick={() => multiSelect ? toggleSelect(item.id) : setSelectedId(item.id)}
                  >
                    <CardContent className="p-1">
                      <div className="aspect-video bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                        {item.type === "IMAGE" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.url}
                            alt={item.filename}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
                      <p className="mt-1 text-xs font-medium truncate">{item.filename}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={multiSelect ? selectedIds.length === 0 : !selectedId}
            >
              {multiSelect ? `Select ${selectedIds.length}` : 'Insert'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
