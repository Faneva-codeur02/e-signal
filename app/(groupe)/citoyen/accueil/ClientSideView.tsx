'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from 'next/dynamic'

const IncidentMap = dynamic(() => import('@/components/IncidentMap'), {
    ssr: false
})

export default function ClientSideView({ incidents }: { incidents: any[] }) {
    const [selectedMedia, setSelectedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null)
    const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number } | null>(null)
    const [statusFilter, setStatusFilter] = useState<string>("all")

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'en attente':
                return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">En attente</span>
            case 'résolu':
                return <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">Résolu</span>
            default:
                return <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded">{status}</span>
        }
    }

    const [userPosition, setUserPosition] = useState<{ lat: number | null; lng: number | null }>({
        lat: null,
        lng: null
    })

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                },
                (error) => {
                    console.warn("Geolocation error:", error)
                }
            )
        }
    }, [])

    const handleSelectIncident = (id: number) => {
        const incident = incidents.find((i) => i.id === id)
        if (incident) {
            setMapCenter({ lat: incident.latitude, lng: incident.longitude })
        }
    }

    const filteredIncidents = incidents.filter(incident => {
        if (statusFilter === "all") return true
        return incident.status.toLowerCase() === statusFilter.toLowerCase()
    })


    return (
        <main className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Signalements des autres citoyens
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                {/* Sélecteur de statut */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par statut :</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                    >
                        <option value="all">Tous</option>
                        <option value="en attente">En attente</option>
                        <option value="résolu">Résolu</option>
                    </select>
                </div>

                {/* Centrage sur incident */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Centrer sur un incident :</label>
                    <select
                        onChange={(e) => handleSelectIncident(parseInt(e.target.value))}
                        defaultValue=""
                        className="p-2 border border-gray-300 rounded-md"
                    >
                        <option value="" disabled>Choisir un incident</option>
                        {filteredIncidents.map((incident) => (
                            <option key={incident.id} value={incident.id}>
                                {incident.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <section>
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Carte des signalements</h2>
                    <IncidentMap incidents={filteredIncidents}
                        userPosition={userPosition}
                        centerOverride={mapCenter} />
                </section>
            </motion.section>

            <hr className="my-8 border-gray-300" />

            {incidents.length === 0 ? (
                <p className="text-gray-600">Aucun incident signalé pour le moment.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {incidents.map((incident, index) => (
                        <motion.div
                            key={incident.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-200 transition transform hover:-translate-y-1"
                        >
                            {incident.mediaUrl && (
                                incident.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                                    <video
                                        className="w-full h-48 object-cover cursor-pointer"
                                        onClick={() => setSelectedMedia({ url: incident.mediaUrl, type: 'video' })}
                                    >
                                        <source src={incident.mediaUrl} type="video/mp4" />
                                        Votre navigateur ne supporte pas la lecture vidéo.
                                    </video>
                                ) : (
                                    <img
                                        src={incident.mediaUrl}
                                        alt={`Image de ${incident.title}`}
                                        className="w-full h-48 object-cover cursor-pointer transition hover:opacity-90"
                                        onClick={() => setSelectedMedia({ url: incident.mediaUrl, type: 'image' })}
                                    />
                                )
                            )}

                            <div className="p-5 space-y-3">
                                <h2 className="text-xl font-semibold text-gray-900">{incident.title}</h2>
                                <p className="text-gray-700 text-sm line-clamp-3">{incident.description}</p>

                                <div className="text-sm text-gray-600 space-y-1">
                                    <p><span className="font-medium text-gray-700">Posté par :</span> {incident.user?.name || "Inconnu"}</p>
                                    <p><span className="font-medium text-gray-700">Statut :</span> {getStatusBadge(incident.status)}</p>
                                    <p><span className="font-medium text-gray-700">Date :</span> {new Date(incident.createAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modale avec animation */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative max-w-4xl w-full px-4"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                            <button
                                className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-400 z-50"
                                onClick={() => setSelectedMedia(null)}
                            >
                                &times;
                            </button>

                            {selectedMedia.type === 'video' ? (
                                <video
                                    controls
                                    className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                                >
                                    <source src={selectedMedia.url} type="video/mp4" />
                                    Votre navigateur ne supporte pas la lecture vidéo.
                                </video>
                            ) : (
                                <img
                                    src={selectedMedia.url}
                                    alt="Aperçu"
                                    className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                                />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}
