// app/profil/page.tsx (par exemple)
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import Navbar from "@/components/Navbar"
import LogoutButton from "@/components/LogoutButton"
import prisma from "@/lib/prisma"
import ChangePasswordForm from "@/components/ChangePasswordForm"

export default async function ProfilPage() {
    const session = await getServerSession(authOptions)

    if (!session) redirect("/auth/login")

    if (session.user.role !== "CITOYEN") {
        redirect("/")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            incidents: {
                orderBy: { createAt: "desc" }
            }
        }
    })

    if (!user) {
        redirect("/auth/login")
    }

    return (
        <div>
            <Navbar />
            <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
                <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

                <div className="space-y-2 mb-8">
                    <p><span className="font-semibold">Nom :</span> {user.name || "Non renseigné"}</p>
                    <p><span className="font-semibold">Email :</span> {user.email}</p>
                    <p><span className="font-semibold">Rôle :</span> {user.role}</p>
                    <p><span className="font-semibold">Inscrit depuis :</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="mb-6 flex space-x-4">
                    <LogoutButton />
                </div>

                <div className="mb-6 flex space-x-4">
                    <ChangePasswordForm />
                </div>
            </main>
        </div>
    )
}
