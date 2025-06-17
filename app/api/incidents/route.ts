import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadFile } from "@/lib/cloudinary";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const formData = await request.formData()

  try {

    // Trouver l'utilisateur en BDD
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
    }

    const file = formData.get('media') as File | null
    let mediaUrl = ''

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await uploadFile(buffer, file.type) as { secure_url: string }
      mediaUrl = result.secure_url
    }

    const incident = await prisma.incident.create({
      data: {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        latitude: parseFloat(formData.get('latitude') as string),
        longitude: parseFloat(formData.get('longitude') as string),
        mediaUrl,
        userId: user.id,
      }
    })

    return NextResponse.json(incident)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        latitude: true,
        longitude: true,
        status: true,
        mediaUrl: true,
        createAt: true
      }
    })
    return NextResponse.json(incidents)
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur de récupération des incidents" },
      { status: 500 }
    )
  }
}
