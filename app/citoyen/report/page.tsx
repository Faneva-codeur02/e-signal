'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MapPin, FileText, LogOut } from "lucide-react"
import Navbar from '@/components/Navbar'


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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

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
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-full max-w-4xl p-4 animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form Skeleton */}
                        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            <div className="h-24 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-12 bg-gray-300 rounded"></div>
                        </div>
                        {/* Map Skeleton */}
                        <div className="bg-white p-1 rounded-lg shadow-md">
                            <div className="h-96 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleGeolocation = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                })
                setIsLocating(false);
            },

            (error) => {
                alert(`Erreur de géolocalisation: ${error.message}`);
                setIsLocating(false);
            }
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true);

        if (!position.lat || !position.lng) {
            alert('Veuillez activer la géolocalisation')
            setIsSubmitting(false);
            return
        }

        if (!session?.user?.id) {
            alert("Impossible de trouver l'identifiant de l'utilisateur.")
            setIsSubmitting(false)
            return
        }


        const data = new FormData()
        data.append('title', formData.title)
        data.append('description', formData.description)
        data.append('category', formData.category)
        data.append('latitude', position.lat.toString())
        data.append('longitude', position.lng.toString())
        data.append('userId', session.user.id)
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
        } finally {
            setIsSubmitting(false)
        }
    }



    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="container mx-auto px-4 py-8">

                    <h1 className="text-3xl font-bold text-center mb-10">Signaler un incident à Madagascar</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Colonne de gauche - Formulaire */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Formulaire de signalement</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'incident</label>
                                    <input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: Accident routier"
                                        required
                                    />
                                    <FileText className="absolute left-3 top-10 text-gray-400" size={18} />
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

                                {formData.media && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-700">Aperçu :</p>
                                        <img src={URL.createObjectURL(formData.media)} alt="Aperçu du fichier" className="h-32 object-cover rounded mt-1" />
                                    </div>
                                )}

                                <div className="bg-blue-50 p-4 rounded-md">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <button
                                            type="button"
                                            onClick={handleGeolocation}
                                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            <MapPin size={16} />
                                            <span>Localiser automatiquement</span>
                                        </button>

                                        {isLocating && <p className="text-sm text-blue-600 animate-pulse">Localisation en cours...</p>}
                                        {position.lat && !isLocating && (
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
                                    disabled={isSubmitting}
                                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5 mr-3 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        'Envoyer le signalement'
                                    )}
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
        </>
    )
}