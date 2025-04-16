'use client'
import { FaMapMarkerAlt, FaImage, FaVideo, FaTrash, FaCheck } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import AuthGuard from "../../components/AuthGuard"

const AdminMap = dynamic(() => import('../../components/AdminMap'), {
  ssr: false,
  loading: () => <div className="bg-gray-100 rounded-lg animate-pulse h-64" />
})

interface Incident {
  id: string
  title: string
  description: string
  category: string
  latitude: number
  longitude: number
  status: 'En attente' | 'En cours' | 'Résolu'
  mediaUrl?: string
  createAt: string | Date
}


export default function AdminDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/incidents')
      .then(res => res.json())
      .then((data: Incident[]) => {
        const formattedData = data.map(incident => ({
          ...incident,
          createAt: new Date(incident.createAt)
        }))
        setIncidents(formattedData)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Chargement...</div>

  return (
    <AuthGuard requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Tableau de bord Admin</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des signalements */}
            <div className="lg:col-span-2 space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{incident.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(incident.createAt).toLocaleString('fr-MG')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${incident.status === 'Résolu' ? 'bg-green-100 text-green-800' :
                        incident.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {incident.status}
                      </span>
                    </div>

                    <p className="mt-2 text-gray-700">{incident.description}</p>

                    {/* Média */}
                    {incident.mediaUrl && (
                      <div className="mt-3">
                        {incident.mediaUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                          <div className="relative group">
                            <img
                              src={incident.mediaUrl}
                              alt="Preuve visuelle"
                              className="rounded-md max-h-40 object-cover"
                            />
                            <a
                              href={incident.mediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all"
                            >
                              <FaImage className="text-white opacity-0 group-hover:opacity-100 text-2xl" />
                            </a>
                          </div>
                        ) : (
                          <video controls className="rounded-md max-h-40">
                            <source src={incident.mediaUrl} type="video/mp4" />
                            Votre navigateur ne supporte pas les vidéos
                          </video>
                        )}
                      </div>
                    )}

                    {/* Position */}
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>
                        {incident.latitude?.toFixed(4)}, {incident.longitude?.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Actions admin */}
                  <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2">
                    <button className="text-red-500 hover:text-red-700 p-2">
                      <FaTrash />
                    </button>
                    <button className="text-green-500 hover:text-green-700 p-2">
                      <FaCheck />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Carte admin */}
            <div className="sticky top-4 h-[calc(100vh-2rem)]">
              <div className="bg-white p-4 rounded-lg shadow-md h-full">
                <h2 className="text-lg font-semibold mb-3">Visualisation cartographique</h2>
                <div className="h-full rounded-md overflow-hidden">
                  <AdminMap incidents={incidents} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
