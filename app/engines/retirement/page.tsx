'use client'
import { useState } from 'react'
import { apiClient } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function RetirementPage() {
  const [form, setForm] = useState({
    current_age: '30', retire_age: '60', life_expectancy: '85', monthly_expenses: '50000',
    inflation: '6', return_pre: '12', return_post: '7', current_savings: '0',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const calculate = async () => {
    const currentAge = parseInt(form.current_age)
    const retireAge = parseInt(form.retire_age)
    if (!(retireAge > currentAge)) {
      toast.error('Retirement age must be greater than current age')
      return
    }
    setLoading(true)
    try {
      const res = await apiClient.getRetirement({
        current_age: currentAge,
        retire_age: retireAge,
        life_expectancy: parseInt(form.life_expectancy) || 85,
        monthly_expenses: parseFloat(form.monthly_expenses),
        inflation: parseFloat(form.inflation) || 6,
        current_savings: parseFloat(form.current_savings) || 0,
        return_pre: parseFloat(form.return_pre) || 12,
        return_post: parseFloat(form.return_post) || 7,
      })
      setResult(res.data)
    } catch (err: any) {
      toast.error(err?.message || 'Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  // Defensive aliasing — backend field names may vary.
  const corpusNeeded = result?.corpus_needed ?? result?.corpus_required
  const futureSavings = result?.future_savings ?? result?.existing_corpus_fv
  const monthlyExpenseAtRetire = result?.monthly_expense_retire ?? result?.monthly_at_retire

  return (
    <div className="max-w-2xl fade-up">
      <div className="mb-6">
        <p className="label mb-1.5">Retirement Planner</p>
        <h1 className="display-md">Plan Your Retirement</h1>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Input label="Current Age" type="number" value={form.current_age} onChange={set('current_age')} />
          <Input label="Retirement Age" type="number" value={form.retire_age} onChange={set('retire_age')} />
          <Input label="Life Expectancy" type="number" value={form.life_expectancy} onChange={set('life_expectancy')} />
          <Input label="Current Monthly Expenses (₹)" type="number" value={form.monthly_expenses} onChange={set('monthly_expenses')} />
          <Input label="Expected Inflation (%)" type="number" value={form.inflation} onChange={set('inflation')} />
          <Input label="Current Savings (₹)" type="number" value={form.current_savings} onChange={set('current_savings')} />
          <Input label="Pre-Retirement Return (%)" type="number" value={form.return_pre} onChange={set('return_pre')} />
          <Input label="Post-Retirement Return (%)" type="number" value={form.return_post} onChange={set('return_post')} />
        </div>
        <Button onClick={calculate} loading={loading} className="w-full">Calculate Retirement Plan</Button>
      </Card>

      {result && (
        <Card gold>
          <p className="label mb-2">Corpus Needed at Retirement</p>
          <p className="display-md mb-6" style={{ color: 'var(--gold)' }}>{formatCurrency(corpusNeeded || 0)}</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}>
              <p className="caption mb-1">Required Monthly SIP</p>
              <p className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>{formatCurrency(result.monthly_sip || 0)}</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}>
              <p className="caption mb-1">Years to Retire</p>
              <p className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>{result.years_to_retire ?? (parseInt(form.retire_age) - parseInt(form.current_age))}</p>
            </div>
            {futureSavings != null && (
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}>
                <p className="caption mb-1">Future Value of Current Savings</p>
                <p className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>{formatCurrency(futureSavings)}</p>
              </div>
            )}
            {monthlyExpenseAtRetire != null && (
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}>
                <p className="caption mb-1">Monthly Expense at Retirement</p>
                <p className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>{formatCurrency(monthlyExpenseAtRetire)}</p>
              </div>
            )}
          </div>

          {result.milestones && result.milestones.length > 0 && (
            <div className="mb-4">
              <p className="label mb-3">Milestones</p>
              <div className="flex flex-col gap-2">
                {result.milestones.map((m: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="body-sm">{m.label} (Age {m.age})</span>
                    <span className="mono font-semibold" style={{ color: 'var(--gold)' }}>{formatCurrency(m.corpus ?? m.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.note && <p className="caption">{result.note}</p>}
        </Card>
      )}
    </div>
  )
}
