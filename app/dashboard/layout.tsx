import { redirect } from 'next/navigation'

import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-dvh bg-beige-50">
      <DashboardSidebar />
      <div className="flex-1 lg:pl-72">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}