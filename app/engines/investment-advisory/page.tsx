'use client'
import { useState } from 'react'
import { apiClient } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import toast from 'react-hot-toast'

const RISK_BADGE: Record<string, string> = {
  Conservative: 'blue',
  Moderate: 'gold',
  'Moderate-Aggressive': 'purple',
  Aggressive: 'red',
}

export default function InvestmentAdvisoryPage() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const getAdvice = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) {
      toast.error('Enter an investment amount')
      return
    }
    setLoading(true)
    try {
      const res = await apiClient.getInvestmentAdvice({ investment_amount: amt })
      setResult(res.data)
    } catch (err: any) {
      // Backend raises ValueError("User not found") if the risk profile
      // hasn't been taken yet — surface that clearly.
      toast.error(err?.message || 'Could not generate advice. Take the Risk Profiler quiz first.')
    } finally {
      setLoading(false)
    }
  }

  const portfolio = result?.portfolio
  const allocation = portfolio?.allocation || []
  const hasExamples = allocation.some((a: any) => a.examples && a.examples.length > 0)

  return (
    <div className="max-w-2xl fade-up">
      <div className="mb-6">
        <p className="label mb-1.5">Investment Advisory</p>
        <h1 className="display-md">Personalized Investment Advice</h1>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <Input label="Investment Amount (₹)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="100000" className="flex-1" onKeyDown={(e) => e.key === 'Enter' && getAdvice()} />
          <Button onClick={getAdvice} loading={loading}>Get Advice</Button>
        </div>
        <p className="caption mt-3">Based on the risk profile you already took in the Risk Profiler engine.</p>
      </Card>

      {result && (
        <div className="flex flex-col gap-4">
          <Card gold>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="label mb-1">Your Risk Profile</p>
                <p className="title-lg">{result.risk_profile}</p>
              </div>
              <Badge variant={RISK_BADGE[result.risk_profile] || 'gray'}>Score: {result.risk_score}/40</Badge>
            </div>
            <p className="body-sm">{result.message}</p>
          </Card>

          {portfolio && (
            <>
              <Card>
                <p className="label mb-2">{portfolio.label || 'Recommended Allocation'}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div><p className="caption">CAGR</p><p className="text-lg font-bold" style={{ color: 'var(--gold)' }}>{portfolio.cagr}%</p></div>
                  <div><p className="caption">Max Drawdown</p><p className="text-lg font-bold" style={{ color: 'var(--red)' }}>{portfolio.max_drawdown}%</p></div>
                  <div><p className="caption">Projected Value</p><p className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>{formatCurrency(portfolio.projected)}</p></div>
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
            </>
          )}

          <p className="caption">Illustrative recommendations based on your stored risk profile. Not SEBI-registered investment advice.</p>
        </div>
      )}
    </div>
  )
}
