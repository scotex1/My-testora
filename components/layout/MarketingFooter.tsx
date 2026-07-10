import Link from 'next/link'

const COLUMNS = [
  { title: 'Product', links: [{ href: '/pricing', label: 'Pricing' }, { href: '/home', label: 'Features' }] },
  { title: 'Company', links: [{ href: '/about', label: 'About' }, { href: '/contact', label: 'Contact' }, { href: '/testimonials', label: 'Testimonials' }] },
  { title: 'Legal', links: [{ href: '/legal/terms', label: 'Terms of Service' }] },
]

export default function MarketingFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-1)', background: 'var(--bg-raised)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>FinVest</p>
          <p className="caption">AI-powered financial planning for every Indian investor.</p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="label mb-3">{col.title}</p>
            <div className="flex flex-col gap-2">
              {col.links.map((l) => (
                <Link key={l.href} href={l.href} className="body-sm hover:underline w-fit">{l.label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 caption" style={{ borderTop: '1px solid var(--border-2)' }}>
        © {new Date().getFullYear()} FinVest. All rights reserved. Not SEBI-registered investment advice.
      </div>
    </footer>
  )
}
