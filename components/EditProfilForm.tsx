'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

type Props = {
    currentName: string
    currentEmail: string
}

export default function EditProfileForm({ currentName, currentEmail }: Props) {
    const router = useRouter()
    const [name, setName] = useState(currentName)
    const [email, setEmail] = useState(currentEmail)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch("/api/user/update-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email }),
        })

        if (res.ok) {
            toast.success("Profil mis à jour avec succès")
            router.refresh()
        } else {
            toast.error("Échec de la mise à jour")
        }

        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-medium">Nom</label>
                <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="block font-medium">Email</label>
                <input
                    type="email"
                    className="w-full border rounded px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
        </form>
    )
}
