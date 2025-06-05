'use client'

import { useState } from "react"

export default function ClientSideView({ incidents }: { incidents: any[] }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    return (
        <main className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Signalements des autres citoyens
            </h1>

            {incidents.length === 0 ? (
                <p className="text-gray-600">Aucun incident signalé pour le moment.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {incidents.map((incident) => (
                        <div
                            key={incident.id}
                            className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition"
                        >
                            {incident.mediaUrl && (
                                <img
                                    src={incident.mediaUrl}
                                    alt={`Image de ${incident.title}`}
                                    className="w-full h-48 object-cover cursor-pointer"
                                    onClick={() => setSelectedImage(incident.mediaUrl)}
                                />
                            )}

                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{incident.title}</h2>
                                <p className="text-gray-700 mb-4 line-clamp-3">{incident.description}</p>
                                <div className="text-sm text-gray-500 space-y-1">
                                    <p><span className="font-medium text-gray-700">Posté par :</span> {incident.user?.name || "Inconnu"}</p>
                                    <p><span className="font-medium text-gray-700">Statut :</span> {incident.status}</p>
                                    <p><span className="font-medium text-gray-700">Date :</span> {new Date(incident.createAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl w-full px-4">
                        <button
                            className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-400"
                            onClick={() => setSelectedImage(null)}
                        >
                            &times;
                        </button>
                        <img src={selectedImage} alt="Aperçu" className="w-full max-h-[80vh] object-contain rounded-xl shadow-xl" />
                    </div>
                </div>
            )}
        </main>
    )
}
