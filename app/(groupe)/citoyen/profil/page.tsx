import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import Navbar from "@/components/Navbar"
import ProfilCard from "@/components/ProfilCard"

export default async function ProfilPage() {
    const session = await getServerSession(authOptions)

    if (!session) redirect("/auth/login")
    if (session.user.role !== "CITOYEN") redirect("/")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    })

    if (!user) redirect("/auth/login")

    return (
        <div>
            <Navbar />
            <ProfilCard user={user} />
        </div>
    )
}
