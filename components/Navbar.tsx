'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="bg-white shadow-md p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Gauche - Liens de navigation */}
                <div className="flex space-x-6">
                    <Link href="/" className="text-gray-700 font-semibold hover:text-blue-600">Accueil</Link>
                    <Link href="/profile" className="text-gray-700 font-semibold hover:text-blue-600">Profil</Link>
                    <Link href="/mes-signalements" className="text-gray-700 font-semibold hover:text-blue-600">Mes signalements</Link>
                </div>

                {/* Droite - User info ou Connexion */}
                <div className="flex items-center space-x-4">
                    {session ? (
                        <>
                            <span className="text-gray-600 hidden md:inline">
                                Bonjour, <span className="font-bold">{session.user?.name || session.user?.email}</span>
                            </span>
                            {session.user?.image && (
                                <img
                                    src={session.user.image}
                                    alt="Profil"
                                    className="w-8 h-8 rounded-full border"
                                />
                            )}
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded"
                            >
                                <LogOut size={16} />
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Connexion
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
