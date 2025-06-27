import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const incidentId = parseInt(params.id)

    try {
        // Récupérer l'incident pour vérifier le propriétaire
        const incident = await prisma.incident.findUnique({
            where: { id: incidentId }
        })

        if (!incident) {
            return NextResponse.json({ error: 'Incident non trouvé' }, { status: 404 })
        }

        // Vérification sécurité : l'utilisateur ne peut supprimer que ses propres signalements
        if (incident.userId !== session.user.id) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
        }

        // Suppression
        await prisma.incident.delete({
            where: { id: incidentId }
        })

        return NextResponse.json({ success: true, message: 'Incident supprimé avec succès' })
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'incident:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
