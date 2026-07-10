'use client'
import { useState } from 'react'
import MarketingNav from '@/components/layout/MarketingNav'
import MarketingFooter from '@/components/layout/MarketingFooter'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      // Wire this to a real /contact backend endpoint when available.
      await new Promise((r) => setTimeout(r, 600))
      toast.success('Message sent — we will get back to you soon')
      setForm({ name: '', email: '', message: '' })
    } catch {
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <MarketingNav />
      <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 fade-up">
        <p className="label mb-2">Get in touch</p>
        <h1 className="display-md mb-6">Contact FinVest</h1>
        <Card>
          <div className="flex flex-col gap-4">
            <Input label="Name" value={form.name} onChange={set('name')} placeholder="Your name" />
            <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
            <Textarea label="Message" rows={5} value={form.message} onChange={set('message')} placeholder="How can we help?" />
            <Button onClick={submit} loading={loading} className="w-full">Send Message</Button>
          </div>
        </Card>
      </main>
      <MarketingFooter />
    </>
  )
}
