import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import Navbar from "@/components/Navbar"
import prisma from "@/lib/prisma"
import ClientSideView from "./ClientSideView"

export default async function CitoyenAccueil() {
    const session = await getServerSession(authOptions)

    if (!session) redirect("/auth/login")
    if (session.user.role !== "CITOYEN") redirect("/")

    const incidents = await prisma.incident.findMany({
        where: {
            userId: { not: session.user.id },
        },
        include: {
            user: true,
        },
        orderBy: {
            createAt: "desc",
        },
    })

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <ClientSideView incidents={JSON.parse(JSON.stringify(incidents))} />
        </div>
    )
}
