import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Input({ label, className, id, ...rest }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <input
        id={inputId}
        className={cn('rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors', className)}
        style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-1)', color: 'var(--text-1)' }}
        {...rest}
      />
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, className, id, ...rest }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <textarea
        id={inputId}
        className={cn('rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors resize-none', className)}
        style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-1)', color: 'var(--text-1)' }}
        {...rest}
      />
    </div>
  )
}
