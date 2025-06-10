
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"
import { verifyPassword, hashPassword } from "@/lib/auth"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) {
        return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    const body = await req.json()
    const { currentPassword, newPassword } = body

    const isValid = await verifyPassword(currentPassword, user.password)

    if (!isValid) {
        return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 })
    }

    const hashedNewPassword = await hashPassword(newPassword)

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword }
    })

    return NextResponse.json({ message: "Mot de passe modifié avec succès." })
}
