'use client'

import { useState } from 'react'
import { Download, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable, Column } from '@/components/ui/data-table'
import { SkeletonTable } from '@/components/ui/skeleton-table'
import { useQuery } from '@tanstack/react-query'
import { AuditLog, ApiResponse, PaginationInfo } from '@/types'

interface AuditLogsResponse {
  data: AuditLog[]
  pagination: PaginationInfo
}

const fetchAuditLogs = async (page: number = 1, search: string = ''): Promise<AuditLogsResponse> => {
  const searchParams = new URLSearchParams()
  searchParams.set('page', page.toString())
  if (search) searchParams.set('search', search)

  const response = await fetch(`/api/admin/audit-logs?${searchParams}`)
  const result: ApiResponse<AuditLog[]> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return {
    data: result.data,
    pagination: result.pagination!,
  }
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page, searchQuery],
    queryFn: () => fetchAuditLogs(page, searchQuery),
  })

  const columns: Column<AuditLog>[] = [
    {
      key: 'user',
      header: 'User',
      render: (log) => log.user?.name || 'System',
    },
    {
      key: 'action',
      header: 'Action',
      render: (log) => (
        <span className="font-mono text-sm">{log.action}</span>
      ),
    },
    {
      key: 'target',
      header: 'Target',
      render: (log) => `${log.targetType}${log.targetId ? `:${log.targetId.slice(0, 8)}` : ''}`,
    },
    {
      key: 'ip',
      header: 'IP Address',
      render: (log) => log.ipAddress || '-',
    },
    {
      key: 'date',
      header: 'Date & Time',
      render: (log) => new Date(log.createdAt).toLocaleString(),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track all system actions"
        actions={
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        }
      />

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <SkeletonTable rows={10} cols={5} />
          ) : (
            <DataTable
              columns={columns}
              data={data?.data || []}
              keyExtractor={(log) => log.id}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
            disabled={page === data.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
