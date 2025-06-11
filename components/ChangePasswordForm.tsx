'use client'

import { useState } from "react"
import toast from "react-hot-toast"

export default function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch('/api/user/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword }),
        })

        setLoading(false)

        if (res.ok) {
            toast.success('Mot de passe modifié avec succès 🎉')
            setCurrentPassword("")
            setNewPassword("")
        } else {
            const data = await res.json()
            toast.error(data.error || "Une erreur est survenue")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <h3 className="text-lg font-semibold">Modifier le mot de passe</h3>

            <input
                type="password"
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded"
            />

            <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded"
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Enregistrement..." : "Changer le mot de passe"}
            </button>
        </form>
    )
}
