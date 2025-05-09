import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Signalement d'Incidents Madagascar</h1>

        <p className="mb-8 text-gray-600">
          Pour signaler un incident, veuillez vous connecter ou créer un compte.
        </p>

        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 text-center"
          >
            Se connecter
          </Link>

          <Link
            href="/auth/register"
            className="block w-full bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 text-center"
          >
            Créer un compte
          </Link>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Comment ça marche ?</h2>
          <ol className="list-decimal list-inside space-y-2 text-left text-gray-700">
            <li>Créez un compte ou connectez-vous</li>
            <li>Remplissez le formulaire de signalement</li>
            <li>Suivez l'évolution de votre signalement</li>
          </ol>
        </div>
      </div>
    </div>
  )
}