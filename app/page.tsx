'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Section principale */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Signalez les incidents autour de vous en toute simplicité
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl"
          >
            Rejoignez notre communauté citoyenne et contribuez à rendre votre environnement plus sûr.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/auth/register" className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
              Commencer maintenant
            </Link>
            <Link href="/auth/login" className="border border-white px-6 py-3 rounded-md hover:bg-white hover:text-blue-600 transition">
              Se connecter
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Illustration en dessous du CTA */}
      <section className="py-10 bg-white text-center">
        <img
          src="/illustration-landing.jpg"
          alt="Illustration"
          className="max-w-xl mx-auto"
        />
      </section>

      {/* Fonctionnalités */}
      <section className="py-16 bg-gray-50 px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-10">
          <h2 className="text-3xl font-bold text-gray-800">Fonctionnalités clés</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold mb-2">Signalement rapide</h3>
              <p className="text-gray-600">Ajoutez un titre, une description, une photo ou vidéo et votre position géographique.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold mb-2">Carte interactive</h3>
              <p className="text-gray-600">Visualisez tous les signalements autour de vous grâce à une carte dynamique.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold mb-2">Suivi des statuts</h3>
              <p className="text-gray-600">Soyez informé de l'évolution de vos signalements en temps réel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="py-20 px-6 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Agissez maintenant</h2>
        <p className="text-lg mb-6">Aidez à améliorer votre ville en signalant les problèmes dès aujourd'hui.</p>
        <Link
          href="/auth/register"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Créer un compte
        </Link>
      </section>


      {/* Footer */}
      <footer className="bg-gray-100 text-center text-sm py-6 mt-auto">
        <p className="text-gray-500">© {new Date().getFullYear()} E-signal. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
