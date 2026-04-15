import { NavLink, Link } from 'react-router-dom'

const navItems: Array<{ to: string; label: string }> = [
  { to: '/', label: '首页' },
  { to: '/ai', label: 'AI法律咨询' },
  { to: '/services', label: '服务选择' },
  { to: '/students', label: '学生参与' },
  { to: '/about', label: '关于我们' },
]

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-full px-3 py-2 text-sm font-medium transition',
          isActive
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
            : 'text-slate-700 hover:bg-white/70 hover:text-slate-900',
        ].join(' ')
      }
      end={to === '/'}
    >
      {label}
    </NavLink>
  )
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-sm shadow-blue-600/25">
            律
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">
              律桥普惠法律互助平台
            </div>
            <div className="hidden text-xs text-slate-600 sm:block">
              AI 初筛 · 学生协同 · 资源指引
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((it) => (
            <NavItem key={it.to} to={it.to} label={it.label} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/ai"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
          >
            立即咨询AI
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-3 sm:px-6 md:hidden">
        <div className="flex flex-wrap gap-2">
          {navItems.map((it) => (
            <NavItem key={it.to} to={it.to} label={it.label} />
          ))}
        </div>
      </div>
    </header>
  )
}

