import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { error } from "console";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.latitude || !body.longitude) {
      return NextResponse.json(
        {
          error: "Coordonnées GPS manquantes",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof body.latitude !== "number" ||
      typeof body.longitude !== "number"
    ) {
      return NextResponse.json(
        {
          error: "Coordonnées GPS invalides",
        },
        {
          status: 400,
        }
      );
    }

    const incident = await prisma.incident.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        latitude: body.latitude,
        longitude: body.longitude,
        mediaUrl: body.mediaUrl,
      },
    });

    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    console.error("Erreur Prisma:", error);
    return NextResponse.json(
      { error: "Erreur de création d'incident" },
      { status: 500 }
    );
  }
}
