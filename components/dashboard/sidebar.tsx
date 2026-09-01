'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  CalendarDays,
  FileText,
  Files,
  HeartPulse,
  Home,
  Inbox,
  LogOut,
  Menu,
  Receipt,
  Settings,
  Users,
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { signOut } from '@/lib/services/auth'

const navSections = [
  {
    label: 'Principal',
    items: [{ href: '/dashboard', label: 'Inicio', icon: Home }],
  },
  {
    label: 'Gestión',
    items: [
      { href: '/dashboard/solicitudes', label: 'Solicitudes', icon: Inbox },
      { href: '/dashboard/pacientes', label: 'Pacientes', icon: Users },
      { href: '/dashboard/agenda', label: 'Agenda', icon: CalendarDays },
      {
        href: '/dashboard/historias-clinicas',
        label: 'Historias clínicas',
        icon: HeartPulse,
      },
      {
        href: '/dashboard/seguimientos',
        label: 'Seguimientos',
        icon: Files,
      },
    ],
  },
  {
    label: 'Administración',
    items: [
      { href: '/dashboard/documentos', label: 'Documentos', icon: FileText },
      { href: '/dashboard/facturacion', label: 'Facturación', icon: Receipt },
      { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
    ],
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  async function handleSignOut() {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-floating lg:hidden"
        aria-label="Abrir menú del panel"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-beige-100 bg-white transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-beige-100 px-6">
          <Link href="/dashboard" className="font-sans text-lg font-medium text-ink-900">
            Psico·<span className="text-primary-600">Stephania</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-beige-100 lg:hidden"
            aria-label="Cerrar menú del panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Panel de gestión">
          {navSections.map((section) => (
            <div key={section.label} className="mb-6 last:mb-0">
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-ink-400">
                {section.label}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive(item.href)
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-ink-500 hover:bg-beige-100 hover:text-ink-900',
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-beige-100 p-4">
          <Link
            href="/"
            className="mb-2 flex items-center justify-center rounded-xl px-3 py-2 text-sm text-ink-500 hover:bg-beige-100"
          >
            Ver sitio público
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}