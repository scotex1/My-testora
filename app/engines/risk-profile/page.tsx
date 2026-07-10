'use client'
import { useState } from 'react'
import { apiClient } from '@/lib/api'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import toast from 'react-hot-toast'

interface Question { text: string; options: { label: string; v: number }[] }

const QUESTIONS: Question[] = [
  { text: 'What is your age group?', options: [{ label: 'Under 25', v: 4 }, { label: '25–40', v: 3 }, { label: '40–55', v: 2 }, { label: 'Above 55', v: 1 }] },
  { text: 'How would you describe your monthly income stability?', options: [{ label: 'Very stable (govt/salaried)', v: 4 }, { label: 'Mostly stable', v: 3 }, { label: 'Variable', v: 2 }, { label: 'Irregular', v: 1 }] },
  { text: 'How many financial dependents do you have?', options: [{ label: 'None', v: 4 }, { label: '1–2', v: 3 }, { label: '3–4', v: 2 }, { label: '5+', v: 1 }] },
  { text: 'What is your investment horizon?', options: [{ label: '10+ years', v: 4 }, { label: '5–10 years', v: 3 }, { label: '2–5 years', v: 2 }, { label: 'Under 2 years', v: 1 }] },
  { text: 'If your portfolio dropped 20% in a month, you would:', options: [{ label: 'Invest more', v: 4 }, { label: 'Hold and wait', v: 3 }, { label: 'Get worried, consider selling', v: 2 }, { label: 'Sell immediately', v: 1 }] },
  { text: 'What is your primary investment goal?', options: [{ label: 'Wealth creation', v: 4 }, { label: 'Long-term growth', v: 3 }, { label: 'Balanced growth + safety', v: 2 }, { label: 'Capital preservation', v: 1 }] },
  { text: 'How many months of expenses do you hold as emergency fund?', options: [{ label: '6+ months', v: 4 }, { label: '3–6 months', v: 3 }, { label: '1–3 months', v: 2 }, { label: 'Less than 1 month', v: 1 }] },
  { text: 'How comfortable are you with market volatility?', options: [{ label: 'Very comfortable', v: 4 }, { label: 'Somewhat comfortable', v: 3 }, { label: 'Slightly uncomfortable', v: 2 }, { label: 'Very uncomfortable', v: 1 }] },
  { text: 'How much can you invest monthly without affecting your lifestyle?', options: [{ label: '30%+ of income', v: 4 }, { label: '15–30% of income', v: 3 }, { label: '5–15% of income', v: 2 }, { label: 'Under 5% of income', v: 1 }] },
  { text: 'How much investing experience do you have?', options: [{ label: '5+ years, diverse assets', v: 4 }, { label: '2–5 years', v: 3 }, { label: 'Under 2 years', v: 2 }, { label: 'None', v: 1 }] },
]

const ALLOCATION: Record<string, { equity: number; debt: number; gold: number; cash: number }> = {
  Conservative: { equity: 15, debt: 55, gold: 20, cash: 10 },
  Moderate: { equity: 50, debt: 35, gold: 10, cash: 5 },
  Aggressive: { equity: 75, debt: 15, gold: 8, cash: 2 },
  'Ultra-Aggressive': { equity: 90, debt: 5, gold: 4, cash: 1 },
}

const ADVICE: Record<string, string> = {
  Conservative: 'Focus on capital preservation through debt instruments and fixed deposits.',
  Moderate: 'A balanced mix of equity and debt mutual funds suits your profile.',
  Aggressive: 'Growth-oriented large and mid-cap equity funds can maximize your returns.',
  'Ultra-Aggressive': 'Maximum growth potential through small-cap and high-risk equity strategies.',
}

function getProfile(score: number): string {
  if (score <= 15) return 'Conservative'
  if (score <= 25) return 'Moderate'
  if (score <= 33) return 'Aggressive'
  return 'Ultra-Aggressive'
}

export default function RiskProfilePage() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [result, setResult] = useState<{ score: number; profile: string } | null>(null)

  const next = async () => {
    if (selected === null) {
      toast.error('Please select an option')
      return
    }
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)

    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1)
      setSelected(null)
    } else {
      const score = newAnswers.reduce((a, b) => a + b, 0)
      const profile = getProfile(score)
      try {
        await apiClient.getRiskProfile({ score, profile, answers: newAnswers })
      } catch {
        /* non-blocking */
      }
      setResult({ score, profile })
    }
  }

  const prev = () => {
    if (index === 0) return
    const newAnswers = answers.slice(0, -1)
    setSelected(answers[answers.length - 1])
    setAnswers(newAnswers)
    setIndex(index - 1)
  }

  const restart = () => {
    setIndex(0)
    setAnswers([])
    setSelected(null)
    setResult(null)
  }

  if (result) {
    const alloc = ALLOCATION[result.profile]
    return (
      <div className="max-w-xl mx-auto fade-up">
        <Card gold>
          <p className="label mb-2">Your Risk Profile</p>
          <h1 className="display-md mb-2" style={{ color: 'var(--gold)' }}>{result.profile}</h1>
          <p className="body-sm mb-6">Score: {result.score} / 40</p>
          <p className="body-sm mb-6">{ADVICE[result.profile]}</p>

          <p className="label mb-3">Recommended Asset Allocation</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}><p className="caption">Equity</p><p className="text-lg font-bold" style={{ color: 'var(--gold)' }}>{alloc.equity}%</p></div>
            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}><p className="caption">Debt</p><p className="text-lg font-bold" style={{ color: 'var(--gold)' }}>{alloc.debt}%</p></div>
            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}><p className="caption">Gold</p><p className="text-lg font-bold" style={{ color: 'var(--gold)' }}>{alloc.gold}%</p></div>
            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}><p className="caption">Cash</p><p className="text-lg font-bold" style={{ color: 'var(--gold)' }}>{alloc.cash}%</p></div>
          </div>
          <Button onClick={restart} variant="outline" className="w-full">Retake Quiz</Button>
        </Card>
      </div>
    )
  }

  const q = QUESTIONS[index]
  return (
    <div className="max-w-xl mx-auto fade-up">
      <div className="mb-6">
        <p className="label mb-1.5">Risk Profiler</p>
        <div className="flex items-center justify-between">
          <h1 className="display-md">Question {index + 1} of {QUESTIONS.length}</h1>
          <Badge variant="gold">{Math.round(((index) / QUESTIONS.length) * 100)}%</Badge>
        </div>
      </div>
      <Card>
        <p className="title-sm mb-5">{q.text}</p>
        <div className="flex flex-col gap-2 mb-6">
          {q.options.map((o) => (
            <button
              key={o.label}
              onClick={() => setSelected(o.v)}
              className="text-left px-4 py-3 rounded-xl text-sm transition-colors"
              style={{
                background: selected === o.v ? 'var(--gold-dim)' : 'var(--bg-overlay)',
                border: `1px solid ${selected === o.v ? 'var(--border-gold)' : 'var(--border-1)'}`,
                color: selected === o.v ? 'var(--gold)' : 'var(--text-1)',
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {index > 0 && <Button variant="outline" onClick={prev}>Back</Button>}
          <Button onClick={next} className="flex-1">{index === QUESTIONS.length - 1 ? 'See Results' : 'Next'}</Button>
        </div>
      </Card>
    </div>
  )
}
