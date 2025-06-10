
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Navbar from "@/components/Navbar"
import Link from "next/link"

interface IncidentDetailPageProps {
    params: { id: string }
}

export default async function IncidentDetailPage({ params }: IncidentDetailPageProps) {
    const incident = await prisma.incident.findUnique({
        where: { id: parseInt(params.id) },
        include: { user: true }
    })

    if (!incident) return notFound()

    return (
        <div>
            <Navbar />
            <main className="max-w-3xl mx-auto p-6 mt-6 bg-white rounded-lg shadow">
                <Link href="/citoyen/profil" className="text-blue-500 hover:underline mb-4 inline-block">
                    ← Retour à mes signalements
                </Link>

                <h1 className="text-3xl font-bold mb-4">{incident.title}</h1>
                <p className="text-gray-700 mb-2">{incident.description}</p>
                <p className="text-sm text-gray-500 mb-4">Posté par : {incident.user?.name || "Inconnu"}</p>
                <p className="text-sm text-gray-500 mb-4">Catégorie : {incident.category}</p>
                <p className="text-sm text-gray-500 mb-4">Statut : {incident.status}</p>
                <p className="text-sm text-gray-500 mb-4">Posté le : {new Date(incident.createAt).toLocaleDateString()}</p>

                {incident.mediaUrl && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Preuve</h2>
                        {incident.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video controls className="w-full rounded">
                                <source src={incident.mediaUrl} type="video/mp4" />
                                Votre navigateur ne supporte pas la lecture vidéo.
                            </video>
                        ) : (
                            <img src={incident.mediaUrl} alt="Preuve" className="w-full rounded" />
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
