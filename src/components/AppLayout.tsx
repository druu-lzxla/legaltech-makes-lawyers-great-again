import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="bg-grid">
        <Navbar />
      </div>
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

