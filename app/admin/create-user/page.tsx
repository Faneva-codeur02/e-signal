'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CreateUserPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'CITOYEN'
    })
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!session || session.user.role !== 'ADMIN') {
            setError('Accès non autorisé')
            return
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) throw new Error(await response.text())
            router.push('/admin/users?created=true')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
        }
    }

    if (!session || session.user.role !== 'ADMIN') {
        return <div>Accès réservé aux administrateurs</div>
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Créer un compte</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                        minLength={8}
                    />
                </div>

                <div>
                    <label>Nom complet</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label>Rôle</label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="CITOYEN">Citoyen</option>
                        <option value="MODERATEUR">Modérateur</option>
                        <option value="ADMIN">Administrateur</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Créer le compte
                </button>
            </form>
        </div>
    )
}