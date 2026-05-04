'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface Author {
  id: string
  name: string
  bio: string
  image: string
  email: string
  isActive: boolean
  createdAt: string
  _count?: {
    articles: number
  }
}

export default function AuthorsPage() {
  const router = useRouter()
  const [authors, setAuthors] = useState<Author[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAuthors = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/authors')
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

  useEffect(() => {
    fetchAuthors()
  }, [])

  const toggleAuthorStatus = async (authorId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/authors/${authorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      const data = await response.json()
      if (data.success) {
        setAuthors(authors.map(a =>
          a.id === authorId ? { ...a, isActive: !currentStatus } : a
        ))
        toast.success(`Author ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status'
      toast.error(errorMessage)
    }
  }

  const deleteAuthor = async (authorId: string) => {
    if (!confirm('Are you sure you want to delete this author?')) return
    try {
      const response = await fetch(`/api/admin/authors/${authorId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        setAuthors(authors.filter(a => a.id !== authorId))
        toast.success('Author deleted successfully')
      } else {
        toast.error(data.message || 'Failed to delete')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete'
      toast.error(errorMessage)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Authors</h1>
        <Button onClick={() => router.push('/admin/authors/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Author
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Authors ({authors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-500 py-4">Loading...</p>
          ) : authors.length === 0 ? (
            <p className="text-gray-500 py-4">No authors found. Add your first author.</p>
          ) : (
            <div className="space-y-4">
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                      {author.image ? (
                        <img
                          src={author.image}
                          alt={author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                          <span className="text-xl">{author.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{author.name}</h3>
                      <p className="text-sm text-gray-500">
                        {author.email || 'No email'} • {author._count?.articles || 0} articles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={author.isActive}
                      onCheckedChange={() => toggleAuthorStatus(author.id, author.isActive)}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/authors/${author.id}/edit`)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteAuthor(author.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
