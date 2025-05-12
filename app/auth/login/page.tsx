'use client'
import { useRouter, useSearchParams } from "next/navigation"
import Link from 'next/link'
import { useState } from "react"
import { signIn, getSession } from "next-auth/react"


export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const searchParams = useSearchParams()
    const registered = searchParams.get('registered')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password
        })

        if (result?.error) {
            setError(result.error)
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
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Se connecter
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