'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import ChangePasswordForm from "@/components/ChangePasswordForm"
import EditProfileForm from "./EditProfilForm"

type ProfilCardProps = {
    user: {
        name: string | null
        email: string
        role: string
        createdAt: Date
    }
}

export default function ProfilCard({ user }: ProfilCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto p-4 md:p-8 mt-6 bg-white rounded-2xl shadow-xl"
        >
            <Tabs defaultValue="profil" className="w-full">
                <TabsList className="flex justify-start mb-6">
                    <TabsTrigger value="profil">Profil</TabsTrigger>
                    <TabsTrigger value="password">Modifier le mot de passe</TabsTrigger>
                </TabsList>

                <TabsContent value="profil">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="/avatar-placeholder.jpg" alt="Photo de profil" />
                            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <p><span className="font-medium">Email :</span> {user.email}</p>
                            <p><span className="font-medium">Rôle :</span> {user.role}</p>
                            <p><span className="font-medium">Inscrit depuis :</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <EditProfileForm currentName={user.name || ""} currentEmail={user.email} />
                </TabsContent>

                <TabsContent value="password">
                    <ChangePasswordForm />
                </TabsContent>
            </Tabs>
        </motion.div>
    )
}
