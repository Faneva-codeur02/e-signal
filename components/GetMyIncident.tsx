'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import SkeletonCardOfMyIncident from './SkeletonCardOfMyIncident'

export default function GetMyIncident() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [incidents, setIncidents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedIncident, setSelectedIncident] = useState<any | null>(null)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (status === 'loading') return

        if (!session) {
            router.push('/auth/login')
            return
        }

        if (session.user.role !== 'CITOYEN') {
            router.push('/')
            return
        }

        const fetchIncidents = async () => {
            try {
                const res = await fetch('/api/mes-incidents')
                const data = await res.json()
                setIncidents(data)
            } catch (error) {
                console.error('Erreur lors du chargement des signalements:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchIncidents()
    }, [session, status, router])

    const handleDelete = async (incidentId: number) => {
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/incidents/${incidentId}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                // Mise à jour de la liste après suppression
                setIncidents((prev) => prev.filter((inc) => inc.id !== incidentId))
                setSelectedIncident(null)
                setConfirmDelete(false)
            } else {
                console.error('Erreur lors de la suppression')
            }
        } catch (error) {
            console.error('Erreur:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <main className="max-w-5xl mx-auto py-10 px-4">
                    <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Mes signalements</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonCardOfMyIncident key={i} />
                        ))}
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div>
            <main className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Mes signalements</h1>

                {incidents.length === 0 ? (
                    <p className="text-center text-gray-600">Vous n'avez pas encore de signalements.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {incidents.map((incident) => (
                            <div
                                key={incident.id}
                                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
                            >
                                <h2 className="text-xl font-semibold mb-2 text-blue-600">{incident.title}</h2>
                                <p className="text-gray-700 mb-2 truncate">{incident.description}</p>
                                <p className="text-sm text-gray-500 mb-1">Catégorie : {incident.category}</p>
                                <p className="text-sm text-gray-500 mb-1">Statut : {incident.status}</p>
                                <p className="text-sm text-gray-500 mb-1">
                                    Posté le : {new Date(incident.createAt).toLocaleDateString()}
                                </p>
                                <button
                                    onClick={() => setSelectedIncident(incident)}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Voir détails
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal animé avec AnimatePresence */}
            <AnimatePresence>
                {selectedIncident && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 relative"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <button
                                onClick={() => setSelectedIncident(null)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                            >
                                &times;
                            </button>

                            <h2 className="text-2xl font-bold mb-4 text-blue-700">{selectedIncident.title}</h2>
                            <p className="text-gray-700 mb-3">{selectedIncident.description}</p>
                            <p className="text-sm text-gray-500 mb-1">Catégorie : {selectedIncident.category}</p>
                            <p className="text-sm text-gray-500 mb-1">Statut : {selectedIncident.status}</p>
                            <p className="text-sm text-gray-500 mb-4">
                                Posté le : {new Date(selectedIncident.createAt).toLocaleString()}
                            </p>

                            {selectedIncident.mediaUrl && (
                                <div className="mb-4">
                                    {selectedIncident.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                                        <video
                                            controls
                                            className="rounded w-full h-60 object-cover"
                                        >
                                            <source src={selectedIncident.mediaUrl} type="video/mp4" />
                                            Votre navigateur ne supporte pas la lecture vidéo.
                                        </video>
                                    ) : (
                                        <img
                                            src={selectedIncident.mediaUrl}
                                            alt="Media"
                                            className="rounded w-full h-60 object-cover"
                                        />
                                    )}
                                </div>
                            )}

                            {!confirmDelete ? (
                                <>
                                    <button
                                        onClick={() => setConfirmDelete(true)}
                                        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition mb-3"
                                    >
                                        Supprimer ce signalement
                                    </button>
                                    <button
                                        onClick={() => setSelectedIncident(null)}
                                        className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
                                    >
                                        Fermer
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-red-700 font-semibold mb-4 text-center">Confirmer la suppression ?</p>
                                    <button
                                        onClick={() => handleDelete(selectedIncident.id)}
                                        disabled={isDeleting}
                                        className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800 transition mb-3"
                                    >
                                        {isDeleting ? 'Suppression en cours...' : 'Oui, supprimer'}
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(false)}
                                        className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
                                    >
                                        Annuler
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
