import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    try {
        const incidents = await prisma.incident.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: { createAt: 'desc' },
        })

        return NextResponse.json(incidents)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Erreur de récupération des incidents' },
            { status: 500 }
        )
    }
}
