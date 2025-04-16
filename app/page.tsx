"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { error } from "console";

//Changement dynamique pour éviter les erreurs SSR
const IncidentMap = dynamic(
  () => import('../components/IncidentMap'),
  {
    ssr: false,
    loading: () => <div className="bg-gray-100 rounded-lg animate-pulse h-full" />
  }
)

export default function ReportPage() {
  const [position, setPosition] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Accident");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [incidents] = useState<any[]>([])

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
        (error) => {
          console.error("Erreur de géolocalisation:", error)
          alert("Impossible d'obtenir votre position. Vérifiez les permissions.")
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur")
    }

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (position.lat === null || position.lng === null) {
      alert("Veuillez d'abord obtenir votre position.");
      return;
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('latitude', position.lat.toString())
    formData.append('longitude', position.lng.toString())
    if (selectedFile) formData.append('media', selectedFile)

    const response = await fetch('/api/incidents', {
      method: 'POST',
      body: formData
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Signaler un incident à Madagascar</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/** Partie gauche */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Formulaire de signalement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'incident</label>
                <input
                  type="text"
                  name="title"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Accident routier"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Déscription détaillée</label>
                <textarea
                  name="description"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez l'incident..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    name="category"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Accident">Accident</option>
                    <option value="Inondation">Inondation</option>
                    <option value="Infrastructure">Infrastructure endomagée</option>
                    <option value="Feu">Feu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-">Preuve photo/vidéo</label>
                  <input
                    type="file"
                    accept="image/*, video/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
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
                    disabled={!!position.lat}
                  >
                    {position.lat ? "Localisation confirmée" : "Obtenir ma position"}
                  </button>
                  {position.lat && (
                    <p className="mt-2 text-sm text-green-600">
                      Position enregistrée: {position.lat?.toFixed(4)},{" "}
                      {position.lng?.toFixed(4)}
                    </p>
                  )}
                  {!position.lat && (
                    <p className="mt-2 text-sm text-red-600">
                      Cliquez pour autoriser la géolocalisation
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Envoyer le signalement
              </button>
            </form>
          </div>

          {/** Colonne de droite - Carte */}
          <div className="bg-white p-1 rounded-lg shadow-md">
            <div className="h-full rounded-md overflow-hidden">
              <IncidentMap
                incidents={incidents}
                userPosition={position}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
