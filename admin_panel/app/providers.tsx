'use client'

import { ReactNode, useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

function AuthHandler() {
  useEffect(() => {
    const originalFetch = window.fetch

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init)

      const url = typeof input === 'string' ? input : input.toString()

      if (
        response.status === 401 &&
        (url.startsWith('/api/') || url.includes('/api/'))
      ) {
        const { signOut } = await import('next-auth/react')
        const { toast } = await import('sonner')

        toast.error('Session expired. Please login again.', {
          duration: 3000,
        })

        await signOut({
          redirect: true,
          callbackUrl: '/login',
        })
      }

      return response
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  return null
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthHandler />
          {children}
          <Toaster position="top-right" richColors />
        </TooltipProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  )
}