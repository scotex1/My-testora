'use client'
import { useState } from 'react'
import { apiClient } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import toast from 'react-hot-toast'

const RISK_OPTIONS = [
  { value: 'conservative', label: 'Conservative' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'moderate-aggressive', label: 'Moderate-Aggressive' },
  { value: 'aggressive', label: 'Aggressive' },
]

export default function PortfolioPage() {
  const [amount, setAmount] = useState('')
  const [risk, setRisk] = useState('moderate')
  const [horizon, setHorizon] = useState('5')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const optimize = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt < 1000) {
      toast.error('Enter investment amount (min ₹1,000)')
      return
    }
    setLoading(true)
    try {
      const res = await apiClient.optimizePortfolio({ amount: amt, risk, horizon: parseInt(horizon) || 5 })
      setResult(res.data)
    } catch (err: any) {
      toast.error(err?.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const allocation = result?.allocation || []
  const hasExamples = allocation.some((a: any) => a.examples && a.examples.length > 0)

  return (
    <div className="max-w-2xl fade-up">
      <div className="mb-6">
        <p className="label mb-1.5">Portfolio Optimizer</p>
        <h1 className="display-md">Optimize Your Portfolio</h1>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Input label="Investment Amount (₹)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="100000" />
          <Select label="Risk Level" value={risk} onChange={(e) => setRisk(e.target.value)} options={RISK_OPTIONS} />
          <Input label="Horizon (years)" type="number" value={horizon} onChange={(e) => setHorizon(e.target.value)} placeholder="5" />
        </div>
        <Button onClick={optimize} loading={loading} className="w-full">Optimize Portfolio</Button>
      </Card>

      {result && (
        <div className="flex flex-col gap-4">
          <Card gold>
            <p className="label mb-2">{result.label || 'Recommended Allocation'}</p>
            <div className="grid grid-cols-3 gap-3">
              <div><p className="caption">CAGR</p><p className="text-lg font-bold" style={{ color: 'var(--gold)' }}>{result.cagr}%</p></div>
              <div><p className="caption">Max Drawdown</p><p className="text-lg font-bold" style={{ color: 'var(--red)' }}>{result.max_drawdown}%</p></div>
              <div><p className="caption">Projected Value</p><p className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>{formatCurrency(result.projected)}</p></div>
            </div>
          </Card>

          <Card>
            <p className="label mb-4">Asset Allocation</p>
            <div className="flex flex-col gap-3">
              {allocation.map((a: any) => (
                <div key={a.asset}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{a.asset}</p>
                    <p className="text-sm font-bold mono" style={{ color: 'var(--gold)' }}>{a.pct}% · {formatCurrency(a.amount)}</p>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                    <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: a.color || 'var(--gold)' }} />
                  </div>
                  {a.expected_return != null && <p className="caption mt-1">Expected return: {a.expected_return}%</p>}
                </div>
              ))}
            </div>
          </Card>

          {hasExamples && (
            <Card>
              <p className="label mb-3">Suggested Funds</p>
              <div className="flex flex-col gap-3">
                {allocation.filter((a: any) => a.examples?.length).map((a: any) => (
                  <div key={a.asset}>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-1)' }}>{a.asset}</p>
                    <div className="flex flex-wrap gap-2">
                      {a.examples.map((ex: string) => (
                        <span key={ex} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: 'var(--bg-overlay)', color: 'var(--text-2)' }}>{ex}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <p className="caption">Illustrative recommendations only, based on historical data. Not SEBI-registered investment advice.</p>
        </div>
      )}
    </div>
  )
}
