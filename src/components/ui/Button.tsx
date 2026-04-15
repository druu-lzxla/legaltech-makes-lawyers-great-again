import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

export function Button({
  className = '',
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60'

  const styles: Record<Variant, string> = {
    primary:
      'bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700',
    secondary:
      'bg-slate-900 text-white shadow-sm shadow-slate-900/15 hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-800 hover:bg-slate-100',
  }

  return (
    <button className={[base, styles[variant], className].join(' ')} {...props} />
  )
}

