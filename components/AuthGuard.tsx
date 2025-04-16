'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

export default function AuthGuard({
  children,
  requiredRole
}: {
  children: ReactNode
  requiredRole?: 'ADMIN' | 'MODERATEUR' | 'CITOYEN'
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    if (requiredRole && session.user.role !== requiredRole) {
      router.push('/unauthorized')
    }
  }, [session, status, router, requiredRole])

  if (status === 'loading' || !session) {
    return <div>Chargement...</div>
  }

  if (requiredRole && session.user.role !== requiredRole) {
    return <div>Accès non autorisé</div>
  }

  return <>{children}</>
}