import prisma from '@/lib/prisma'

export default async function AdminPage() {
  const incidents = await prisma.incident.findMany({
    orderBy: [
        {
             createAt: 'desc' 
        }
    ]
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord Admin</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-3 px-6">Titre</th>
              <th className="py-3 px-6">Catégorie</th>
              <th className="py-3 px-6">Statut</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id} className="border-b">
                <td className="py-4 px-6">{incident.title}</td>
                <td className="py-4 px-6">{incident.category}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded ${
                    incident.status === 'Résolu' ? 'bg-green-100' : 
                    incident.status === 'En cours' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {incident.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button className="text-blue-600 hover:underline">
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}