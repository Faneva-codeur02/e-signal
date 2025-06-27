'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
    const { data: session } = useSession()
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()
    const [showLogoutModal, setShowLogoutModal] = useState(false)



    const navLinks = [
        { href: '/citoyen/accueil', label: 'Accueil' },
        { href: '/citoyen/profil', label: 'Profil' },
        { href: '/citoyen/mes-signalements', label: 'Mes signalements' },
        { href: '/citoyen/report', label: 'Signaler un incident' },
    ]

    return (
        <nav className="bg-white shadow-md fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo + menu */}
                    <div className="flex items-center">
                        <button
                            className="text-gray-700 lg:hidden focus:outline-none"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <Menu size={28} />
                        </button>

                        <div className="hidden lg:flex space-x-6 ml-6">
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`font-semibold ${pathname === href
                                        ? 'text-blue-600 underline'
                                        : 'text-gray-700 hover:text-blue-600'
                                        }`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Profil / Auth */}
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
                                    onClick={() => setShowLogoutModal(true)}
                                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded"
                                >
                                    <LogOut size={16} />
                                    <span className="hidden sm:inline">Déconnexion</span>
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
            </div>

            {/* Menu Mobile */}
            {menuOpen && (
                <div className="lg:hidden bg-white border-t">
                    <div className="flex flex-col px-4 py-2 space-y-2">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className={`font-medium ${pathname === href
                                    ? 'text-blue-600 underline'
                                    : 'text-gray-700 hover:text-blue-600'
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <AnimatePresence>
                {showLogoutModal && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center space-y-4"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                            <h2 className="text-lg font-semibold text-gray-800">Confirmation</h2>
                            <p className="text-gray-600">Voulez-vous vraiment vous déconnecter ?</p>

                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded"
                                >
                                    Se déconnecter
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
