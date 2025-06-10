
"use client"

import { useState } from "react"

export default function DeleteIncidentButton({ incidentId }: { incidentId: number }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        const confirmed = confirm("Voulez-vous vraiment supprimer ce signalement ?")
        if (!confirmed) return

        setLoading(true)

        try {
            const response = await fetch(`/api/incidents/${incidentId}`, {
                method: "DELETE",
            })

            if (response.ok) {
                // Reload page to refresh incidents list
                window.location.reload()
            } else {
                alert("Erreur lors de la suppression du signalement.")
            }
        } catch (error) {
            console.error("Erreur suppression :", error)
            alert("Erreur lors de la suppression.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className={`px-3 py-1 rounded transition text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
        >
            {loading ? "Suppression..." : "Supprimer"}
        </button>
    )
}
