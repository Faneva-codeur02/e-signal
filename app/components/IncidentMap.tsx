'use client'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix des icônes Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png'
})

//centrage automatique
function RecenterMap({ lat, lng }: { lat: number, lng: number }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo([lat, lng], 15, {
      duration: 2
    })
  }, [lat, lng, map])

  return null
}

export default function IncidentMap({
  incidents,
  userPosition
}: {
  incidents: any[],
  userPosition: { lat: number | null, lng: number | null }
}) {
  return (
    <MapContainer
      center={[-18.8792, 47.5079]} // Antananarivo
      zoom={13}
      className="h-[500px] w-full mt-8"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Afficher la position utilisateur si disponible */}
      {userPosition.lat && userPosition.lng && (
        <>
          <Marker position={[userPosition.lat, userPosition.lng]}>
            <Popup>Votre position actuelle</Popup>
          </Marker>
          <RecenterMap lat={userPosition.lat} lng={userPosition.lng} />
        </>
      )}

      {/* Afficher les incidents */}
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