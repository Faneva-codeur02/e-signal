import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    const session = await getServerSession({ req, ...authOptions })
    if (!session) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user || !user.password) {
        return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
        return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    })

    return NextResponse.json({ success: true })
}
