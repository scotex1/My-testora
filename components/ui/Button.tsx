import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export default function Button({ variant = 'primary', size = 'md', loading = false, disabled, className, children, ...rest }: ButtonProps) {
  const isDisabled = disabled || loading
  const sizeClass = size === 'sm' ? 'px-3.5 py-2 text-sm' : size === 'lg' ? 'px-6 py-3.5 text-base' : 'px-5 py-2.5 text-sm'
  const styleFor = () => {
    if (variant === 'primary') return { background: 'var(--gold)', color: '#12151A' }
    if (variant === 'outline') return { background: 'transparent', color: 'var(--text-1)', border: '1px solid var(--border-1)' }
    return { background: 'transparent', color: 'var(--text-2)' }
  }
  return (
    <button
      disabled={isDisabled}
      className={cn('inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150', sizeClass, isDisabled ? 'opacity-60 cursor-not-allowed' : 'active:scale-[0.98]', className)}
      style={styleFor()}
      {...rest}
    >
      {loading && <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}
