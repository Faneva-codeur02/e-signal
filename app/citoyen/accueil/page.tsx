import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import Navbar from "@/components/Navbar"
import prisma from "@/lib/prisma"

export default async function CitoyenAccueil() {
    const session = await getServerSession(authOptions)

    if (!session) redirect("/auth/login")

    // Vérifie le rôle
    if (session.user.role !== "CITOYEN") {
        redirect("/") // ou une autre page selon le rôle
    }

    // Charger les incidents des autres citoyens
    const incidents = await prisma.incident.findMany({
        where: {
            userId: {
                not: session.user.id,
            },
        },
        include: {
            user: true,
        },
        orderBy: {
            createAt: "desc",
        },
    })

    return (
        <div>
            <Navbar />
            <main className="p-4">
                <h1 className="text-2xl font-bold mb-4">Signalements des autres citoyens</h1>
                <ul className="space-y-4">
                    {incidents.map((incident) => (
                        <li key={incident.id} className="border p-4 rounded">
                            <h2 className="text-xl font-semibold">{incident.title}</h2>
                            <p>{incident.description}</p>
                            <p className="text-sm text-gray-600">Posté par : {incident.user?.name || "Inconnu"}</p>
                            <p className="text-sm text-gray-600">Statut : {incident.status}</p>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    )
}
