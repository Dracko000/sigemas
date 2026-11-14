const TOKEN_KEY = 'sigemas.token';
const BASE = (import.meta.env.VITE_API_URL as string | undefined) || '';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  raw?: boolean;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, raw, ...rest } = options;
  const token = tokenStore.get();
  const headers = new Headers(rest.headers);
  if (body !== undefined) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${BASE}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    tokenStore.clear();
    window.dispatchEvent(new CustomEvent('sigemas:unauthorized'));
  }

  if (!response.ok) {
    let message = 'Terjadi kesalahan. Coba lagi.';
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, response.status);
  }

  if (raw) return response as unknown as T;
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const API_BASE = BASE;
