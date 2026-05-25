// 모든 API 호출 한 곳에서 처리. Authorization 헤더 자동 첨부 + JSON 직렬화/역직렬화.

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

interface StoredUser {
  id: number;
  nickname: string;
  token: string;
}

// localStorage에서 토큰 꺼내기 (없으면 undefined)
function getToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const raw = localStorage.getItem('birthday-user');
  if (!raw) return undefined;
  try {
    return (JSON.parse(raw) as StoredUser).token;
  } catch {
    return undefined;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean; // true면 토큰 헤더 자동 첨부
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  { method = 'GET', body, auth = false }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = '오류가 발생했어요';
    try {
      const j = await res.json();
      if (j?.message) message = Array.isArray(j.message) ? j.message[0] : j.message;
    } catch {}
    throw new ApiError(res.status, message);
  }

  // 204 No Content 대비
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<T>(path, { ...opts, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<T>(path, { ...opts, method: 'PATCH', body, auth: true }),
  delete: <T>(path: string, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<T>(path, { ...opts, method: 'DELETE', auth: true }),
};