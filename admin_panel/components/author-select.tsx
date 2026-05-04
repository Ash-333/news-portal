'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface Author {
  id: string
  name: string
  image?: string
}

interface AuthorSelectProps {
  value: string
  onValueChange: (value: string) => void
  error?: string
}

export default function AuthorSelect({ value, onValueChange, error }: AuthorSelectProps) {
  const router = useRouter()
  const [authors, setAuthors] = useState<Author[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('/api/authors')
        const data = await response.json()
        if (data.success) {
          setAuthors(data.data)
        }
      } catch (error) {
        console.error('Error fetching authors:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuthors()
  }, [])

  return (
    <div>
      <div className="flex items-center gap-2">
       <Select
           options={authors.map((author) => ({
             value: author.id,
             label: author.name
           }))}
          value={value}
          onChange={onValueChange}
          placeholder={isLoading ? 'Loading authors...' : 'Select author'}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => router.push('/admin/authors/new')}
          title="Add new author"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  )
}
