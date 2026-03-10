const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8081'

export function getApiUrl() {
  return API_URL
}

export async function apiFetch<T>(
  path: string,
  options: { token?: string | null; method?: string; body?: unknown } = {}
): Promise<T> {
  const { token, method = 'GET', body } = options
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Error ${res.status}`)
  }

  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<T>
  }
  return {} as T
}
