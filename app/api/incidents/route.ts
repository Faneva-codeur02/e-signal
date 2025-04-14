import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadFile } from "@/lib/cloudinary";
import { Readable } from 'stream';

export async function POST(request: Request) {
  const formData = await request.formData()

  try {
    const file = formData.get('media') as File | null
    let mediaUrl = ''

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await uploadFile(buffer) as { secure_url: string }
      mediaUrl = result.secure_url 
    }

    const incident = await prisma.incident.create({
      data: {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        latitude: parseFloat(formData.get('latitude') as string),
        longitude: parseFloat(formData.get('longitude') as string),
        mediaUrl
      }
    })
    
    return NextResponse.json(incident)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, {status: 500})
  }
}
