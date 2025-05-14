'use client'
import { useRouter, useSearchParams } from "next/navigation"
import Link from 'next/link'
import { useState, useEffect } from "react"
import { signIn, getSession } from "next-auth/react"

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loadingForm, setLoadingForm] = useState(false)
    const [loadingPage, setLoadingPage] = useState(true)
    const [registered, setRegistered] = useState<string | null>(null)
    const searchParams = useSearchParams()

    useEffect(() => {
        setTimeout(() => {
            setRegistered(searchParams.get('registered'))
            setLoadingPage(false)
        }, 1000)
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoadingForm(true)

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password
        })

        if (result?.error) {
            setError(result.error)
            setLoadingForm(false)
        } else {
            // récupérer la session pour lire le rôle
            const session = await getSession()
            console.log("SESSION:", session)

            if (session?.user?.role === 'ADMIN') {
                window.location.href = '/admin' // redirection admin
            } else {
                window.location.href = '/report' // redirection user normal
            }
        }
    }

    if (loadingPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mt-6"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>

                {registered && (
                    <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                        Inscription réussie ! Veuillez vous connecter.
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loadingForm}
                        className={`w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded transition ${loadingForm ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                    >
                        {loadingForm ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Vous n'avez pas de compte ?{' '}
                        <Link href="/auth/register" className="text-blue-600 hover:underline">
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}