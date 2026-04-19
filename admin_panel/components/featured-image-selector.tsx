"use client"

import { useState } from "react"
import { Image as ImageIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Media } from "@/types"
import { MediaLibraryModal } from "@/components/media-library-modal"

interface FeaturedImageSelectorProps {
  value?: Media | null
  onChange: (media: Media | null) => void
}

export function FeaturedImageSelector({ value, onChange }: FeaturedImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (media: Media) => {
    onChange(media)
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Featured Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="aspect-video rounded-md border bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.url} alt={value.filename} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-slate-400 text-xs">
              <ImageIcon className="w-6 h-6 mb-1" />
              <span>No featured image selected</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" className="flex-1" onClick={() => setIsOpen(true)}>
            {value ? "Change Image" : "Select Image"}
          </Button>
          {value && (
            <Button type="button" size="sm" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>

        <MediaLibraryModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelect={handleSelect}
        />
      </CardContent>
    </Card>
  )
}
