'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const IncidentMap = dynamic(
    () => import('@/components/IncidentMap'),
    {
        ssr: false,
        loading: () => <div className="bg-gray-100 rounded-lg animate-pulse h-full" />
    }
)

export default function ReportPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [position, setPosition] = useState<{ lat: number | null, lng: number | null }>({ lat: null, lng: null })
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Accident',
        media: null as File | null
    })

    useEffect(() => {
        if (status === 'loading') return

        if (status === "unauthenticated") {
            router.push("/")
        }

        if (!session) {
            router.push('/auth/login') // redirection si pas connecté
        } else if (session.user?.role === 'ADMIN') {
            router.push('/admin') // redirection si admin
        }

    }, [session, status, router])

    if (status === 'loading' || !session || session.user?.role === 'ADMIN') {
        return <p className="text-center py-10">Chargement de la session...</p>
    }

    const handleGeolocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => setPosition({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            }),
            (error) => alert(`Erreur de géolocalisation: ${error.message}`)
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!position.lat || !position.lng) {
            alert('Veuillez activer la géolocalisation')
            return
        }

        const data = new FormData()
        data.append('title', formData.title)
        data.append('description', formData.description)
        data.append('category', formData.category)
        data.append('latitude', position.lat.toString())
        data.append('longitude', position.lng.toString())
        if (formData.media) data.append('media', formData.media)

        try {
            const response = await fetch('/api/incidents', {
                method: 'POST',
                body: data
            })

            if (response.ok) {
                alert('Signalement envoyé avec succès!')
                setFormData({
                    title: '',
                    description: '',
                    category: 'Accident',
                    media: null
                })
            }
        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {session && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Se déconnecter
                        </button>
                    </div>
                )}
                <h1 className="text-3xl font-bold text-center mb-8">Signaler un incident à Madagascar</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Colonne de gauche - Formulaire */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Formulaire de signalement</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'incident</label>
                                <input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: Accident routier"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description détaillée</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    placeholder="Décrivez l'incident..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Accident">Accident</option>
                                        <option value="Déchets">Déchets sauvages</option>
                                        <option value="Inondation">Inondation</option>
                                        <option value="Infrastructure">Infrastructure endommagée</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preuve photo/vidéo</label>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={(e) => setFormData({ ...formData, media: e.target.files?.[0] || null })}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-md">
                                <div className="flex items-center space-x-3 mb-2">
                                    <button
                                        type="button"
                                        onClick={handleGeolocation}
                                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        <span>📍</span>
                                        <span>Localiser automatiquement</span>
                                    </button>

                                    {position.lat && (
                                        <span className="text-sm text-gray-600">
                                            Position: {position.lat.toFixed(4)}, {position.lng?.toFixed(4)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">
                                    La carte se centrera automatiquement sur votre position
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
                            >
                                Envoyer le signalement
                            </button>
                        </form>
                    </div>

                    {/* Colonne de droite - Carte */}
                    <div className="bg-white p-1 rounded-lg shadow-md">
                        <div className="h-full rounded-md overflow-hidden">
                            <IncidentMap
                                incidents={[]}
                                userPosition={position}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}