import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]/route'

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)

    // Seul un admin peut créer des comptes avec des rôles élevés
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json(
            { error: 'Non autorisé' },
            { status: 403 }
        )
    }

    try {
        const body = await request.json()
        const { email, password, name, role = 'CITOYEN' } = body

        // Validation simple
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email et mot de passe requis" },
                { status: 400 }
            )
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Un utilisateur avec cet email existe déjà" },
                { status: 400 }
            )
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 12)

        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role // Assurez-vous que le rôle est valide
            }
        })

        // Retourner l'utilisateur sans le mot de passe
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json(userWithoutPassword, { status: 201 })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: "Erreur lors de l'inscription" },
            { status: 500 }
        )
    }
}