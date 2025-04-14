"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const IncidentMap = dynamic(() => import('../app/components/IncidentMap'), {
  ssr: false
})

export default function Home() {
  const [position, setPosition] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Accident");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleGeolocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (position.lat === null || position.lng === null) {
      alert ("Veuillez d'abord obtenir votre position.");
      return;
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('latitude', position.lat.toString())
    formData.append('longitude', position.lng.toString() )
    if (selectedFile) formData.append('media', selectedFile)

    const response  = await fetch('/api/incidents', {
      method: 'POST',
      body: formData
    })
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Signaler un incident</h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block mb-2">Titre</label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border rounded"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2">Déscription</label>
          <textarea
            name="description"
            className="w-full p-2 border rounded"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value) }
          />
        </div>

        <div>
          <label className="block mb-2">Preuve</label>
          <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="mt-2"
            />
        </div>

        <div>
          <label className="block mb-2">Catégorie</label>
          <select 
            name="category" 
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Accident">Accident</option>
            <option value="Inondation">Inondation</option>
            <option value="Déchets">Déchets sauvages</option>
            <option value="Feu">Feu</option>
          </select>
        </div>

        <div>
          <button
            type="button"
            onClick={handleGeolocation}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
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

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Envoyer
        </button>
      </form>

      <IncidentMap incidents={[]}/>
    </main>
  );
}
