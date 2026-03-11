const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  user?: T;
  error?: string;
  message?: string;
}

/**
 * Core fetch wrapper. Automatically includes cookies (httpOnly auth_token)
 * with every request. Never attaches tokens manually — the browser handles it.
 */
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include', // Sends httpOnly cookies cross-origin
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const json = await res.json();
  return json as ApiResponse<T>;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (email: string, password: string, role: 'player' | 'coach') =>
    apiFetch<{ id: string; email: string; role: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),

  login: (email: string, password: string) =>
    apiFetch<{ id: string; email: string; role: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch<null>('/api/auth/logout', { method: 'POST' }),
};

// ─── Bounty Board (Requests) ─────────────────────────────────────────────────

export interface CoachingRequest {
  id: string;
  player_id: string;
  game_title: string;
  target_rank: string;
  goal: string;
  budget: number;
  description: string | null;
  discord_tag: string | null;      // null = masked by paywall
  social_links: string | null;     // null = masked by paywall
  exact_username: string | null;   // null = masked by paywall
  status: 'open' | 'filled' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const requestsApi = {
  getAll: (page = 1, limit = 20) =>
    apiFetch<CoachingRequest[]>(`/api/requests?page=${page}&limit=${limit}`),

  getOne: (id: string) =>
    apiFetch<CoachingRequest>(`/api/requests/${id}`),

  create: (payload: {
    game_title: string;
    target_rank: string;
    goal: string;
    budget: number;
    description?: string;
    discord_tag?: string;
    social_links?: string;
    exact_username?: string;
  }) =>
    apiFetch<CoachingRequest>('/api/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: Partial<CoachingRequest>) =>
    apiFetch<CoachingRequest>(`/api/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    apiFetch<null>(`/api/requests/${id}`, { method: 'DELETE' }),
};

// ─── Coach Profiles ───────────────────────────────────────────────────────────

export interface CoachProfile {
  user_id: string;
  email: string;
  bio: string | null;
  game_expertise: string[] | null;
  rank: string | null;
  subscription_status: 'free' | 'pro';
  created_at: string;
}

export const coachesApi = {
  getAll: () =>
    apiFetch<CoachProfile[]>('/api/coaches'),

  getOne: (id: string) =>
    apiFetch<CoachProfile>(`/api/coaches/${id}`),

  updateMe: (payload: { bio?: string; game_expertise?: string[]; rank?: string }) =>
    apiFetch<CoachProfile>('/api/coaches/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};
