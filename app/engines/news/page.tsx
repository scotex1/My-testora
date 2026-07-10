'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'market', label: 'Market' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'mutual-funds', label: 'Mutual Funds' },
  { id: 'economy', label: 'Economy' },
  { id: 'global', label: 'Global' },
]

const SENTIMENT_LABEL: Record<string, { label: string; variant: string }> = {
  positive: { label: 'Bullish', variant: 'green' },
  negative: { label: 'Bearish', variant: 'red' },
  neutral: { label: 'Neutral', variant: 'gray' },
}

export default function NewsPage() {
  const [cat, setCat] = useState('all')
  const { data, isLoading } = useQuery({
    queryKey: ['market-news', cat],
    queryFn: () => apiClient.getNews(cat).then((r) => r.data),
    refetchInterval: 5 * 60_000,
    staleTime: 3 * 60_000,
  })
  const articles = data?.articles || []

  return (
    <div className="fade-up">
      <div className="mb-6">
        <p className="label mb-1.5">Market News</p>
        <h1 className="display-md">AI-Curated Market News</h1>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className="px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors"
            style={{
              background: cat === c.id ? 'var(--gold-dim)' : 'var(--bg-overlay)',
              color: cat === c.id ? 'var(--gold)' : 'var(--text-2)',
              border: `1px solid ${cat === c.id ? 'var(--border-gold)' : 'var(--border-1)'}`,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[0, 1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: 'var(--bg-hover)' }} />)}</div>
      ) : articles.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📰</div>
            <p className="title-sm mb-2">No news available</p>
            <p className="body-sm">Connect a News API key in the backend .env to enable this engine.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
          {articles.map((a: any) => {
            const s = SENTIMENT_LABEL[a.sentiment] || SENTIMENT_LABEL.neutral
            return (
              <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer">
                <Card className="h-full hover:opacity-90 transition-opacity">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={s.variant}>{s.label}</Badge>
                    <span className="caption">{a.category}</span>
                  </div>
                  <p className="title-sm mb-2 leading-snug">{a.title}</p>
                  <p className="body-sm mb-3" style={{ fontSize: '0.8125rem' }}>{a.summary}</p>
                  <div className="flex items-center justify-between caption">
                    <span>{a.source}</span>
                    <span>{formatDate(a.published_at)}</span>
                  </div>
                </Card>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
