'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import toast from 'react-hot-toast'

const GOAL_TYPES = [
  { value: 'home', label: '🏠 Home' }, { value: 'car', label: '🚗 Car' }, { value: 'education', label: '🎓 Education' },
  { value: 'wedding', label: '💍 Wedding' }, { value: 'travel', label: '✈️ Travel' }, { value: 'emergency', label: '🛡️ Emergency Fund' },
  { value: 'business', label: '💼 Business' }, { value: 'custom', label: '🎯 Custom' },
]

function monthsToTargetDate(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toISOString().slice(0, 7)
}

// Local fallback SIP formula — used only if the backend call fails.
function calcSIP(fv: number, rAnnual: number, months: number, existing = 0): number {
  if (months <= 0 || fv <= 0) return 0
  const r = rAnnual / 100 / 12
  const n = months
  const pv = existing * Math.pow(1 + r, n)
  const needed = Math.max(0, fv - pv)
  if (r === 0) return needed / n
  return (needed * r) / (Math.pow(1 + r, n) - 1)
}

export default function GoalPlannerPage() {
  const qc = useQueryClient()
  const [goalType, setGoalType] = useState('home')
  const [goalName, setGoalName] = useState('')
  const [amount, setAmount] = useState('')
  const [months, setMonths] = useState('')
  const [currentSaved, setCurrentSaved] = useState('')
  const [annualReturn, setAnnualReturn] = useState('12')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const { data: goalsData } = useQuery({ queryKey: ['goals'], queryFn: () => apiClient.getGoals().then((r) => r.data) })
  const goals = goalsData?.goals || []

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteGoal(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['goals'] }); toast.success('Goal removed') },
  })

  const calculate = async () => {
    const targetAmount = parseFloat(amount)
    const monthsNum = parseInt(months)
    if (!targetAmount || !monthsNum) {
      toast.error('Enter target amount and duration')
      return
    }
    setLoading(true)
    const saved = parseFloat(currentSaved) || 0
    const returnRate = parseFloat(annualReturn) || 12

    try {
      const res = await apiClient.getGoalPlan({
        goal_type: goalType,
        goal_name: goalName || GOAL_TYPES.find((g) => g.value === goalType)?.label || 'Goal',
        target_amount: targetAmount,
        target_date: monthsToTargetDate(monthsNum),
        current_saved: saved,
        annual_return: returnRate,
      })
      setResult(res.data)
    } catch {
      // Fallback: compute locally
      const sip = calcSIP(targetAmount, returnRate, monthsNum, saved)
      const milestones = [0.25, 0.5, 0.75].map((pct) => ({
        label: `${pct * 100}% Mark`,
        month: Math.round(monthsNum * pct),
        amount: Math.round(targetAmount * pct),
        pct: pct * 100,
      }))
      setResult({
        goal_type: goalType,
        goal_name: goalName || 'Goal',
        target_amount: targetAmount,
        months: monthsNum,
        sip_required: Math.round(sip),
        milestones,
      })
      toast('Calculated locally — backend unavailable', { icon: '⚠️' })
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    if (!result) return
    try {
      await apiClient.saveGoal({
        goal_type: result.goal_type,
        goal_name: result.goal_name,
        target_amount: result.target_amount,
        months: result.months || parseInt(months),
        sip_required: result.sip_required,
        annual_return: parseFloat(annualReturn),
        current_saved: parseFloat(currentSaved) || 0,
      })
      qc.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Goal saved')
      setResult(null)
      setGoalName(''); setAmount(''); setMonths(''); setCurrentSaved('')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save goal')
    }
  }

  return (
    <div className="max-w-2xl fade-up">
      <div className="mb-6">
        <p className="label mb-1.5">Goal Planner</p>
        <h1 className="display-md">Plan Your Financial Goal</h1>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Select label="Goal Type" value={goalType} onChange={(e) => setGoalType(e.target.value)} options={GOAL_TYPES} />
          <Input label="Goal Name" value={goalName} onChange={(e) => setGoalName(e.target.value)} placeholder="e.g. Dream Home" />
          <Input label="Target Amount (₹)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="2000000" />
          <Input label="Duration (months)" type="number" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="60" />
          <Input label="Already Saved (₹)" type="number" value={currentSaved} onChange={(e) => setCurrentSaved(e.target.value)} placeholder="0" />
          <Input label="Expected Annual Return (%)" type="number" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} placeholder="12" />
        </div>
        <Button onClick={calculate} loading={loading} className="w-full">Calculate SIP</Button>
      </Card>

      {result && (
        <Card gold className="mb-6">
          <p className="label mb-2">Required Monthly SIP</p>
          <p className="display-md mb-4" style={{ color: 'var(--gold)' }}>{formatCurrency(result.sip_required)}</p>
          {result.milestones && (
            <div className="grid grid-cols-3 gap-2 mb-5">
              {result.milestones.map((m: any) => (
                <div key={m.label} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-overlay)' }}>
                  <p className="caption mb-1">{m.label}</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>{formatCurrency(m.amount)}</p>
                  <p className="caption">Month {m.month}</p>
                </div>
              ))}
            </div>
          )}
          <Button onClick={save} className="w-full">Save Goal</Button>
        </Card>
      )}

      {goals.length > 0 && (
        <div>
          <p className="title-sm mb-3">Your Goals</p>
          <div className="flex flex-col gap-2">
            {goals.map((g: any) => (
              <div key={g.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-1)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{g.goal_name}</p>
                  <p className="caption">{formatCurrency(g.target_amount)} · {g.months} months</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="mono text-sm font-bold" style={{ color: 'var(--gold)' }}>{formatCurrency(g.sip_required)}/mo</p>
                  <button onClick={() => deleteMutation.mutate(g.id)} className="text-lg" style={{ color: 'var(--text-3)' }}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
