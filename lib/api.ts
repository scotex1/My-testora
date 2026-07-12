import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getFirebaseAuth } from './firebase'

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'https://your-backend.com/api/v1',
  timeout: 45000, // Render free-tier cold starts can take 30-50s
})

// ── Request interceptor: attach Firebase ID token ──────────────────────────
api.interceptors.request.use(async (config) => {
  try {
    const user = getFirebaseAuth().currentUser
    if (user) {
      const token = await user.getIdToken()
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    // Silently continue without a token; backend rejects with 401,
    // handled below.
  }
  return config
})

// ── Response interceptor: refresh token once on 401, else redirect ─────────
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const config = err.config as RetryConfig
    if (err.response?.status === 401 && config && !config._retry) {
      config._retry = true
      try {
        const token = await getFirebaseAuth().currentUser?.getIdToken(true)
        if (token) {
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${token}`
          return api(config)
        }
      } catch {
        /* fall through to redirect */
      }
      if (typeof window !== 'undefined') window.location.href = '/auth/login'
    }
    const data = err.response?.data as any
    const msg = data?.message || data?.detail || err.message || 'Something went wrong'
    return Promise.reject(new Error(typeof msg === 'string' ? msg : JSON.stringify(msg)))
  }
)

export default api

export const apiClient = {
  syncUser: (d: { uid: string; email: string; name?: string; photo?: string }) => api.post('/auth/sync', d),

  getProfile: () => api.get('/user/profile'),
  updateProfile: (d: { name?: string; phone?: string; city?: string; occupation?: string; income?: string }) =>
    api.put('/user/profile', d),
  getPlan: () => api.get('/user/plan'),
  getStats: () => api.get('/user/dashboard-stats'),
  getGoals: () => api.get('/user/goals'),
  saveGoal: (d: {
    goal_type: string; goal_name: string; target_amount: number; months: number
    sip_required: number; annual_return?: number; current_saved?: number
  }) => api.post('/user/goals', d),
  deleteGoal: (id: string) => api.delete(`/user/goals/${id}`),

  // FREE engines
  getRiskProfile: (d: { score: number; profile: string; answers: number[] }) => api.post('/engines/risk-profile', d),
  getNews: (category = 'all') => api.get('/engines/news', { params: { category } }),

  // BASIC+ engines
  getGoalPlan: (d: {
    goal_type: string; goal_name: string; target_amount: number; target_date: string
    current_saved?: number; annual_return?: number
  }) => api.post('/engines/goal-planner', d),
  getRetirement: (d: {
    current_age: number; retire_age: number; life_expectancy?: number; monthly_expenses: number
    inflation?: number; current_savings?: number; return_pre?: number; return_post?: number
  }) => api.post('/engines/retirement', d),

  // PRO+ engines
  analyzeStock: (d: { symbol: string }) => api.post('/engines/stock-analysis', d),
  optimizePortfolio: (d: { amount: number; risk: string; horizon: number }) => api.post('/engines/portfolio', d),
  getGlobalEvents: () => api.get('/engines/global-events'),

  // PRO+ — Market Data (engines/market_data.py: fetch_stock_quote, fetch_fundamentals, fetch_market_indices)
  getMarketQuote: (symbol: string) => api.get('/engines/market-data/quote', { params: { symbol } }),
  getMarketFundamentals: (symbol: string) => api.get('/engines/market-data/fundamentals', { params: { symbol } }),
  getMarketIndices: () => api.get('/engines/market-data/indices'),

  // PRO+ — Investment Advisory (engines/investment_engine.py: InvestmentEngine.get_personalized_advice)
  // Backend reads risk_profile/risk_score from the authenticated user's stored
  // Firebase record — only investment_amount needs to be sent.
  getInvestmentAdvice: (d: { investment_amount: number }) => api.post('/engines/investment-advisory', d),

  // Payment — Cashfree Orders API (Hosted Checkout, manual renewal).
  // Backend constructs return_url itself from settings.FRONTEND_URL — do
  // NOT send return_url from the client, it's ignored. Cashfree redirects
  // to {FRONTEND_URL}/dashboard/subscription?order_id=...&order_status=...
  // (backend must NOT include a .html suffix there — Next.js uses clean routes).
  createOrder: (d: { plan_id: string; idempotency_key: string }) => api.post('/payment/create-order', d),
  // Response: { success, message, plan_id?, plan_name?, expiry_date?, amount? }
  // on PAID, or { success: false, status: 'PENDING'|'FAILED', message } otherwise.
  // This returns HTTP 200 in both cases — always check res.data.success,
  // never rely on the request throwing.
  verifyPayment: (d: { order_id: string }) => api.post('/payment/verify', d),
  getPaymentHistory: () => api.get('/payment/history'),
}
