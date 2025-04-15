'use client'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

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

// Fix nécessaire pour les icônes
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/marker-icon-2x.png',
        iconUrl: '/marker-icon.png',
        shadowUrl: '/marker-shadow.png'
    })
}


export default function AdminMap({ incidents }: { incidents: Incident[] }) {
    return (
        <MapContainer
            center={[-18.8792, 47.5079]} // Centré sur Madagascar
            zoom={6}
            className="h-full w-full"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {incidents.map((incident) => (
                <Marker
                    key={incident.id}
                    position={[incident.latitude, incident.longitude]}
                >
                    <Popup className="max-w-xs">
                        <div>
                            <h3 className="font-bold">{incident.title}</h3>
                            <p className="text-sm text-gray-600">{incident.category}</p>
                            <p className="text-xs mt-1">{new Date(incident.createAt).toLocaleString()}</p>

                            {incident.mediaUrl && (
                                <div className="mt-2">
                                    {incident.mediaUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                                        <img
                                            src={incident.mediaUrl}
                                            alt="Preuve"
                                            className="max-h-24 mx-auto"
                                        />
                                    ) : (
                                        <video controls className="max-h-24">
                                            <source src={incident.mediaUrl} type="video/mp4" />
                                        </video>
                                    )}
                                </div>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}