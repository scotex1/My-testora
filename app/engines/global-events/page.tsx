'use client'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const IMPACT_BADGE: Record<string, string> = { high: 'red', medium: 'gold', low: 'gray' }

export default function GlobalEventsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['global-events'],
    queryFn: () => apiClient.getGlobalEvents().then((r) => r.data),
    refetchInterval: 10 * 60_000,
  })
  const events = data?.events || []
  const sentiment = data?.sentiment || null

  return (
    <div className="fade-up">
      <div className="mb-6">
        <p className="label mb-1.5">Global Events</p>
        <h1 className="display-md">Macro Events & Market Impact</h1>
      </div>

      {sentiment && (
        <Card className="mb-6">
          <p className="label mb-3">Market Sentiment</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}><p className="text-xl font-bold" style={{ color: 'var(--green)' }}>{sentiment.bullish ?? 0}</p><p className="caption">Bullish</p></div>
            <div className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}><p className="text-xl font-bold" style={{ color: 'var(--text-2)' }}>{sentiment.neutral ?? 0}</p><p className="caption">Neutral</p></div>
            <div className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-overlay)' }}><p className="text-xl font-bold" style={{ color: 'var(--red)' }}>{sentiment.bearish ?? 0}</p><p className="caption">Bearish</p></div>
          </div>
        </Card>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-3">{[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--bg-hover)' }} />)}</div>
      ) : events.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <div className="text-4xl mb-3">🌐</div>
            <p className="title-sm mb-2">No global events yet</p>
            <p className="body-sm">Global events will appear here once the backend fetches from news APIs.</p>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-3 stagger">
          {events.map((ev: any) => (
            <Card key={ev.id}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{ev.flag}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{ev.event || ev.title}</p>
                    <p className="caption">{ev.region} · {ev.category} · {formatDate(ev.date)}</p>
                  </div>
                </div>
                <Badge variant={IMPACT_BADGE[ev.impact] || 'gray'}>{ev.impact} impact</Badge>
              </div>
              <p className="body-sm mb-3" style={{ fontSize: '0.8125rem' }}>{ev.description}</p>
              {ev.india_impact && (
                <div className="p-3 rounded-xl mb-2" style={{ background: 'var(--gold-dim)' }}>
                  <p className="caption mb-1" style={{ color: 'var(--gold)' }}>India Impact</p>
                  <p className="body-sm" style={{ fontSize: '0.8125rem' }}>{ev.india_impact}</p>
                </div>
              )}
              {ev.affected_sectors?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {ev.affected_sectors.map((s: string) => (
                    <span key={s} className="px-2 py-0.5 rounded-md text-xs" style={{ background: 'var(--bg-overlay)', color: 'var(--text-3)' }}>{s}</span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
