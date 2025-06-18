'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function LayoutWrapper({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const isHome = pathname === '/'
    const isLogin = pathname === '/auth/login'
    const isRegister = pathname === '/auth/register'

    return (
        <main className={isHome && isLogin && isRegister ? '' : 'pt-16'}>
            {children}
        </main>
    )
}
