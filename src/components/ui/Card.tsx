import type { PropsWithChildren } from 'react'

export function Card({
  children,
  className = '',
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={[
        'rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-900/5',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

