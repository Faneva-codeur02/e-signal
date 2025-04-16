import NextAuth, { AuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { User } from "@prisma/client"

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<{ id: string; email: string; name: string | null; role: string } | null> {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email et mot de passe requis")
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || !user.password) {
                    throw new Error("Utilisateur non trouvé")
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isValid) {
                    throw new Error("Mot de passe incorrect")
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role
                session.user.id = token.id
            }
            return session
        }
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }