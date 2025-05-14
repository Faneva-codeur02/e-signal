'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'CITOYEN'
    })
    const [error, setError] = useState('')
    const router = useRouter()
    const [loadingForm, setLoadingForm] = useState(false)
    const [loadingPage, setLoadingPage] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoadingPage(false)
        }, 1000)
    }, [])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoadingForm(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Erreur lors de l'inscription")
            }
            setLoadingForm(false)
            // Rediriger vers la page de connexion après inscription réussie
            router.push('/auth/login?registered=true')

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
                setLoadingForm(false)
            } else {
                setError("Une erreur inconnue est survenue")
                setLoadingForm(false)
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
                <h1 className="text-2xl font-bold mb-6 text-center">Créer un compte</h1>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Nom complet (optionnel)</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Email*</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Mot de passe*</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                            minLength={6}
                        />
                    </div>

                    {/* Champ caché pour le rôle par défaut */}
                    <input type="hidden" name="role" value="CITOYEN" />

                    <button
                        type="submit"
                        disabled={loadingForm}
                        className={`w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded transition ${loadingForm ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                    >
                        {loadingForm ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'S\'inscrire'
                        )}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Déjà un compte ?{' '}
                        <Link href="/auth/login" className="text-blue-600 hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}