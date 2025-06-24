'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function LayoutWrapper({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const isHome = pathname === '/'
    const isLogin = pathname === '/auth/login'
    const isRegister = pathname === '/auth/register'

    const noPadding = isHome || isLogin || isRegister

    return (
        <main className={noPadding ? '' : 'pt-16'}>
            {children}
        </main>
    )
}
