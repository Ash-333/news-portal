export interface ApiError {
  success: false
  message: string
  data?: unknown
}

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T; message: string }> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (response.status === 401) {
    throw new Error('UNAUTHORIZED')
  }

  if (response.status === 204) {
    return { data: null as unknown as T, message: 'Success' }
  }

  const result = await response.json()

  if (!response.ok && !result.success) {
    throw new Error(result.message || 'Request failed')
  }

  return result
}

export async function getApi<T = unknown>(url: string): Promise<T> {
  const result = await apiFetch<T>(url)
  return result.data
}

export async function postApi<T = unknown>(
  url: string,
  data?: unknown
): Promise<T> {
  const result = await apiFetch<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
  return result.data
}

export async function putApi<T = unknown>(
  url: string,
  data?: unknown
): Promise<T> {
  const result = await apiFetch<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
  return result.data
}

export async function patchApi<T = unknown>(
  url: string,
  data?: unknown
): Promise<T> {
  const result = await apiFetch<T>(url, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })
  return result.data
}

export async function deleteApi<T = unknown>(url: string): Promise<T> {
  const result = await apiFetch<T>(url, {
    method: 'DELETE',
  })
  return result.data
}