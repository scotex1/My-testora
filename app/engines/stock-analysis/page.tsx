'use client'
import { useState } from 'react'
import { apiClient } from '@/lib/api'
import { formatNumber } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import toast from 'react-hot-toast'

const QUICK_PICKS = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'WIPRO', 'ICICIBANK', 'BAJFINANCE']

const VERDICT_CATEGORY: Record<string, string> = {
  'STRONG BUY': 'bullish', BUY: 'bullish', HOLD: 'neutral', SELL: 'bearish', 'STRONG SELL': 'bearish',
}
const CATEGORY_BADGE: Record<string, string> = { bullish: 'green', neutral: 'gold', bearish: 'red' }

export default function StockAnalysisPage() {
  const [symbol, setSymbol] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const analyze = async (sym?: string) => {
    const s = (sym ?? symbol).trim()
    if (!s) {
      toast.error('Enter a stock symbol')
      return
    }
    const normalized = s.toUpperCase()
    setSymbol(normalized)
    setLoading(true)
    try {
      const res = await apiClient.analyzeStock({ symbol: normalized })
      setResult(res.data)
    } catch (err: any) {
      toast.error(err?.message || 'Analysis failed. Check the symbol and try again.')
    } finally {
      setLoading(false)
    }
  }

  const verdict = result?.verdict || 'HOLD'
  const category = VERDICT_CATEGORY[verdict] || 'neutral'
  const changePositive = (result?.change_pct || 0) >= 0

  return (
    <div className="max-w-2xl fade-up">
      <div className="mb-6">
        <p className="label mb-1.5">Stock Analysis</p>
        <h1 className="display-md">AI Stock Analysis</h1>
      </div>

      <Card className="mb-4">
        <div className="flex gap-2 mb-4">
          <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="e.g. RELIANCE" className="flex-1" onKeyDown={(e) => e.key === 'Enter' && analyze()} />
          <Button onClick={() => analyze()} loading={loading}>Analyze</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_PICKS.map((s) => (
            <button key={s} onClick={() => analyze(s)} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: 'var(--bg-overlay)', color: 'var(--text-2)', border: '1px solid var(--border-1)' }}>
              {s}
            </button>
          ))}
        </div>
      </Card>

      {result && (
        <div className="flex flex-col gap-4">
          <Card gold>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="display-md" style={{ color: 'var(--gold)' }}>{result.symbol}</h2>
                <p className="caption">{result.name} · {result.exchange} · {result.sector}</p>
              </div>
              <Badge variant={CATEGORY_BADGE[category]}>{verdict}</Badge>
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <p className="text-2xl font-bold mono" style={{ color: 'var(--text-1)' }}>₹{result.price}</p>
              <p className="text-sm font-semibold" style={{ color: changePositive ? 'var(--green)' : 'var(--red)' }}>
                {changePositive ? '▲' : '▼'} {result.change} ({result.change_pct}%)
              </p>
            </div>
          </Card>

          <Card>
            <p className="label mb-3">Fundamentals</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Stat label="P/E" value={result.pe} />
              <Stat label="P/B" value={result.price_to_book} />
              <Stat label="ROE" value={result.roe ? `${result.roe}%` : '—'} />
              <Stat label="D/E" value={result.de} />
              <Stat label="52W High" value={result.week_52_high ? `₹${result.week_52_high}` : '—'} />
              <Stat label="52W Low" value={result.week_52_low ? `₹${result.week_52_low}` : '—'} />
              <Stat label="Market Cap" value={result.mcap ? formatNumber(result.mcap) : '—'} />
              <Stat label="Dividend Yield" value={result.dividend_yield ? `${result.dividend_yield}%` : '—'} />
              <Stat label="EPS" value={result.eps} />
            </div>
          </Card>

          <Card>
            <p className="label mb-3">Technicals</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Stat label="RSI" value={result.rsi} sub={result.rsi_signal} />
              <Stat label="MACD" value={result.macd} />
              <Stat label="MA50" value={result.ma50} />
              <Stat label="MA200" value={result.ma200} />
              <Stat label="Momentum" value={result.momentum} />
            </div>
          </Card>

          <Card>
            <p className="label mb-3">Growth</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Stat label="Revenue Growth" value={result.revenue_growth ? `${result.revenue_growth}%` : '—'} />
              <Stat label="Profit Growth" value={result.profit_growth ? `${result.profit_growth}%` : '—'} />
              <Stat label="Profit Margin" value={result.profit_margin ? `${result.profit_margin}%` : '—'} />
            </div>
          </Card>

          {result.ai_summary && (
            <Card>
              <p className="label mb-2">AI Summary</p>
              <p className="body-sm">{result.ai_summary}</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: any; sub?: string }) {
  return (
    <div className="p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}>
      <p className="caption mb-1">{label}</p>
      <p className="text-sm font-bold mono" style={{ color: 'var(--text-1)' }}>{value ?? '—'}</p>
      {sub && <p className="caption">{sub}</p>}
    </div>
  )
}
