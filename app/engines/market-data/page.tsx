'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { formatNumber } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

const QUICK_PICKS = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'WIPRO', 'ICICIBANK', 'BAJFINANCE']

const INDEX_LABELS: Record<string, string> = {
  SENSEX: 'SENSEX',
  NIFTY_50: 'NIFTY 50',
  BANK_NIFTY: 'BANK NIFTY',
  GOLD_INR: 'Gold (₹)',
  USD_INR: 'USD/INR',
}

export default function MarketDataPage() {
  const [symbol, setSymbol] = useState('')
  const [quote, setQuote] = useState<any>(null)
  const [fundamentals, setFundamentals] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Indices refresh independently of the quote lookup — matches the
  // 15-min in-memory cache TTL on the backend, refetch a bit less often.
  const { data: indices, isLoading: indicesLoading } = useQuery({
    queryKey: ['market-indices'],
    queryFn: () => apiClient.getMarketIndices().then((r) => r.data),
    refetchInterval: 10 * 60_000,
    staleTime: 5 * 60_000,
  })

  const lookup = async (sym?: string) => {
    const s = (sym ?? symbol).trim()
    if (!s) {
      toast.error('Enter a stock symbol')
      return
    }
    const normalized = s.toUpperCase()
    setSymbol(normalized)
    setLoading(true)
    setFundamentals(null)
    try {
      const res = await apiClient.getMarketQuote(normalized)
      setQuote(res.data)
      // Fundamentals fetched separately (60-min cache on backend) —
      // don't block the quote from showing if this one is slower/fails.
      apiClient
        .getMarketFundamentals(normalized)
        .then((r) => setFundamentals(r.data))
        .catch(() => setFundamentals(null))
    } catch (err: any) {
      toast.error(err?.message || `Symbol not found: ${normalized}. Check NSE/BSE symbol and retry.`)
      setQuote(null)
    } finally {
      setLoading(false)
    }
  }

  const changePositive = (quote?.change ?? 0) >= 0

  return (
    <div className="max-w-2xl fade-up">
      <div className="mb-6">
        <p className="label mb-1.5">Market Data</p>
        <h1 className="display-md">Live Market Data</h1>
      </div>

      {/* Indices */}
      <Card className="mb-6">
        <p className="label mb-3">Market Indices</p>
        {indicesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--bg-hover)' }} />)}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(indices || {}).map(([key, val]: [string, any]) => {
              const positive = (val.change ?? 0) >= 0
              return (
                <div key={key} className="p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}>
                  <p className="caption mb-1">{INDEX_LABELS[key] || key}</p>
                  <p className="text-sm font-bold mono" style={{ color: 'var(--text-1)' }}>{val.price}</p>
                  <p className="text-xs font-semibold" style={{ color: positive ? 'var(--green)' : 'var(--red)' }}>
                    {positive ? '▲' : '▼'} {val.change} ({val.change_pct}%)
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Quote lookup */}
      <Card className="mb-4">
        <div className="flex gap-2 mb-4">
          <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="e.g. RELIANCE" className="flex-1" onKeyDown={(e) => e.key === 'Enter' && lookup()} />
          <Button onClick={() => lookup()} loading={loading}>Lookup</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_PICKS.map((s) => (
            <button key={s} onClick={() => lookup(s)} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: 'var(--bg-overlay)', color: 'var(--text-2)', border: '1px solid var(--border-1)' }}>
              {s}
            </button>
          ))}
        </div>
      </Card>

      {quote && (
        <div className="flex flex-col gap-4">
          <Card gold>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="display-md" style={{ color: 'var(--gold)' }}>{quote.symbol}</h2>
                <p className="caption">{quote.name} · {quote.exchange}</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <p className="text-2xl font-bold mono" style={{ color: 'var(--text-1)' }}>₹{quote.price}</p>
              <p className="text-sm font-semibold" style={{ color: changePositive ? 'var(--green)' : 'var(--red)' }}>
                {changePositive ? '▲' : '▼'} {quote.change} ({quote.change_pct}%)
              </p>
            </div>
            <p className="caption mt-1">Prev close: ₹{quote.prev_close}</p>
          </Card>

          <Card>
            <p className="label mb-3">Day Range & Volume</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Stat label="Day High" value={quote.day_high ? `₹${quote.day_high}` : '—'} />
              <Stat label="Day Low" value={quote.day_low ? `₹${quote.day_low}` : '—'} />
              <Stat label="Volume" value={quote.volume ? formatNumber(quote.volume) : '—'} />
              <Stat label="52W High" value={quote.week_52_high ? `₹${quote.week_52_high}` : '—'} />
              <Stat label="52W Low" value={quote.week_52_low ? `₹${quote.week_52_low}` : '—'} />
              <Stat label="Market Cap" value={quote.market_cap ? formatNumber(quote.market_cap) : '—'} />
            </div>
          </Card>

          {fundamentals && Object.keys(fundamentals).length > 0 && (
            <Card>
              <p className="label mb-3">Fundamentals</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Stat label="P/E" value={fundamentals.pe_ratio} />
                <Stat label="Forward P/E" value={fundamentals.forward_pe} />
                <Stat label="EPS" value={fundamentals.eps} />
                <Stat label="Book Value" value={fundamentals.book_value} />
                <Stat label="P/B" value={fundamentals.price_to_book} />
                <Stat label="Dividend Yield" value={fundamentals.dividend_yield ? `${fundamentals.dividend_yield}%` : '—'} />
                <Stat label="ROE" value={fundamentals.roe ? `${fundamentals.roe}%` : '—'} />
                <Stat label="D/E" value={fundamentals.debt_to_equity} />
                <Stat label="Revenue Growth" value={fundamentals.revenue_growth ? `${fundamentals.revenue_growth}%` : '—'} />
                <Stat label="Earnings Growth" value={fundamentals.earnings_growth ? `${fundamentals.earnings_growth}%` : '—'} />
                <Stat label="Profit Margin" value={fundamentals.profit_margin ? `${fundamentals.profit_margin}%` : '—'} />
                <Stat label="Current Ratio" value={fundamentals.current_ratio} />
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}>
      <p className="caption mb-1">{label}</p>
      <p className="text-sm font-bold mono" style={{ color: 'var(--text-1)' }}>{value ?? '—'}</p>
    </div>
  )
}
