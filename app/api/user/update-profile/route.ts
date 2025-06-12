import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new NextResponse("Non autorisé", { status: 401 })
    }

    const { name, email } = await req.json()

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { name, email },
        })

        return new NextResponse("Profil mis à jour", { status: 200 })
    } catch (error) {
        console.error("Erreur mise à jour profil:", error)
        return new NextResponse("Erreur serveur", { status: 500 })
    }
}
