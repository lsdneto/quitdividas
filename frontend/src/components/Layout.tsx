import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/devedores', label: 'Devedores' },
  { to: '/relatorios', label: 'Relatórios' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth()

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link to="/" className="font-bold text-lg text-slate-900 no-underline">
            QuitDívidas
          </Link>
          <nav className="flex gap-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'font-semibold' : 'text-slate-600 no-underline')}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span>{user?.name}</span>
            <button onClick={logout} className="rounded bg-slate-900 px-3 py-1 text-white">
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  )
}
