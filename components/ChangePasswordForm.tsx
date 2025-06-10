'use client'

import { useState } from "react"

export default function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage("")
        if (newPassword !== confirmPassword) {
            setMessage("Le nouveau mot de passe ne correspond pas.")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/user/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword })
            })

            const data = await res.json()

            if (res.ok) {
                setMessage("Mot de passe modifié avec succès.")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            } else {
                setMessage(data.error || "Erreur lors du changement.")
            }
        } catch (error) {
            console.error(error)
            setMessage("Erreur serveur.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Modifier mon mot de passe</h2>

            {message && (
                <p className="text-sm text-red-600">{message}</p>
            )}

            <div>
                <label className="block text-sm font-medium">Mot de passe actuel</label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Nouveau mot de passe</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Confirmer le nouveau mot de passe</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
                {loading ? "Envoi en cours..." : "Modifier le mot de passe"}
            </button>
        </form>
    )
}
