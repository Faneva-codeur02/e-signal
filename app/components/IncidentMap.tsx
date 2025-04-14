'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Incident } from '@prisma/client'

// Fix des icônes Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png'
})

export default function IncidentMap({ incidents }: { incidents: Incident[] }) {
  return (
    <MapContainer 
      center={[-18.8792, 47.5079]} // Antananarivo
      zoom={6} 
      className="h-[500px] w-full mt-8"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.latitude, incident.longitude]}
        >
          <Popup>
            <h3 className="font-bold">{incident.title}</h3>
            <p>{incident.description}</p>
            {incident.mediaUrl && (
              <img 
                src={incident.mediaUrl} 
                alt="Preuve" 
                className="mt-2 max-h-32"
              />
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}