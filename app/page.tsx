"use client";

import { useState } from "react";

export default function Home() {
  const [position, setPosition] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });

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

    if (!position.lat || !position.lng) {
      alert("Veuillez activer la géolocalisation");
      return;
    }

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          category: formData.get("category"),
          latitude: position.lat,
          longitude: position.lng,
          mediaUrl: "",
        }),
      });

      if (!response.ok) throw new Error("Echec de la requête");
      alert("Incident signalé avec succès!");
    } catch (error) {
      console.error(error);
      alert("Erreur lors du signalement");
    }
  };

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
          />
        </div>

        <div>
          <label className="block mb-2">Déscription</label>
          <textarea
            name="description"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Catégorie</label>
          <select name="category" className="w-full p-2 border rounded">
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
    </main>
  );
}
